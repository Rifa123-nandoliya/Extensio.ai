import { Request, Response } from "express";
import { getStripe, getStripeWebhookSecret } from "../config/stripe";
import {
  syncSubscriptionFromStripe,
  downgradeUserToFree,
} from "../services/stripe.service";
import User from "../models/user.model";

export const handleStripeWebhook = async (req: Request, res: Response) => {
  const stripe = getStripe();
  const sig = req.headers["stripe-signature"];

  if (!sig || typeof sig !== "string") {
    return res.status(400).send("Missing stripe-signature header");
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      getStripeWebhookSecret()
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook error";
    console.error("Stripe webhook verification failed:", message);
    return res.status(400).send(`Webhook Error: ${message}`);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        if (
          session.mode === "subscription" &&
          session.subscription &&
          typeof session.subscription === "string"
        ) {
          await syncSubscriptionFromStripe(session.subscription);
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object;
        await syncSubscriptionFromStripe(subscription.id);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const userId = subscription.metadata?.userId;
        if (userId) {
          await downgradeUserToFree(userId);
        } else if (typeof subscription.customer === "string") {
          const user = await User.findOne({
            stripeCustomerId: subscription.customer,
          });
          if (user) {
            await downgradeUserToFree(user._id.toString());
          }
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object;
        if (
          invoice.subscription &&
          typeof invoice.subscription === "string"
        ) {
          const user = await User.findOne({
            stripeSubscriptionId: invoice.subscription,
          });
          if (user) {
            user.subscriptionStatus = "past_due";
            await user.save();
          }
        }
        break;
      }

      default:
        break;
    }
  } catch (error) {
    console.error("Stripe webhook handler error:", error);
    return res.status(500).json({ received: false });
  }

  res.status(200).json({ received: true });
};
