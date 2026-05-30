import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  Check,
  Zap,
  Crown,
  Loader2,
  CreditCard,
  ArrowRight,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useBilling } from "../hooks/useBilling";
import { useAuth } from "../hooks/useAuth";
import {
  createCheckoutSession,
  createBillingPortalSession,
  cancelSubscription,
  resumeSubscription,
  changeSubscriptionPlan,
} from "../services/api";
import { showSuccess } from "../utils/toast";
import { SkeletonMetric } from "../components/ui/Skeleton";

const freeFeatures = [
  "5 generations per day",
  "Basic templates",
  "Standard generation speed",
];

const proFeatures = [
  "Unlimited generations",
  "Premium templates",
  "Priority generation",
  "All future Pro features",
];

const Billing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { billing, loading, refetch } = useBilling();
  const { refreshUser } = useAuth();
  const [actionLoading, setActionLoading] = useState(null);
  const [notice, setNotice] = useState(null);

  const stripeReady = billing?.stripe?.checkoutConfigured;
  const webhookReady = billing?.stripe?.webhookConfigured;

  const isPro =
    billing?.subscriptionPlan === "pro" &&
    ["active", "trialing"].includes(billing?.subscriptionStatus);

  useEffect(() => {
    const checkout = searchParams.get("checkout");
    if (checkout === "success") {
      setNotice({
        type: "success",
        text: "Subscription activated. Welcome to Pro!",
      });
      refreshUser();
      refetch();
      setSearchParams({}, { replace: true });
    } else if (checkout === "canceled") {
      setNotice({ type: "info", text: "Checkout was canceled." });
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams, refreshUser, refetch]);

  const runAction = async (key, fn, successMessage) => {
    try {
      setActionLoading(key);
      await fn();
      await refreshUser();
      await refetch();
      if (successMessage) {
        showSuccess(successMessage);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCheckout = (plan) => {
    runAction(`checkout-${plan}`, async () => {
      const data = await createCheckoutSession(plan);
      window.location.href = data.url;
    });
  };

  const handlePortal = () => {
    runAction("portal", async () => {
      const data = await createBillingPortalSession();
      window.location.href = data.url;
    });
  };

  const handleCancel = () => {
    if (
      !window.confirm(
        "Cancel subscription at the end of the current billing period?"
      )
    ) {
      return;
    }
    runAction(
      "cancel",
      cancelSubscription,
      "Subscription will cancel at period end"
    );
  };

  const handleResume = () => {
    runAction("resume", resumeSubscription, "Subscription resumed");
  };

  const handleChangePlan = (plan) => {
    runAction(
      `change-${plan}`,
      () => changeSubscriptionPlan(plan),
      "Subscription plan updated"
    );
  };

  const formatPeriodEnd = (timestamp) => {
    if (!timestamp) return null;
    return new Date(timestamp * 1000).toLocaleDateString(undefined, {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <DashboardLayout
      title="Billing"
      subtitle="Manage your subscription and usage"
    >
      {notice && (
        <div
          className={`mb-6 rounded-2xl border px-4 py-3 text-sm ${
            notice.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-zinc-200 bg-zinc-50 text-zinc-700"
          }`}
        >
          {notice.text}
        </div>
      )}

      {!loading && !stripeReady && (
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 sm:px-5">
          <div className="flex gap-3">
            <AlertTriangle
              size={20}
              className="mt-0.5 shrink-0 text-amber-600"
            />
            <div className="min-w-0">
              <p className="font-medium text-amber-900">
                Stripe is not configured on the server
              </p>
              <p className="mt-1 text-sm text-amber-800">
                Add{" "}
                <code className="rounded bg-amber-100 px-1 py-0.5 text-xs">
                  STRIPE_SECRET_KEY
                </code>
                ,{" "}
                <code className="rounded bg-amber-100 px-1 py-0.5 text-xs">
                  STRIPE_PRICE_PRO_MONTHLY
                </code>
                , and{" "}
                <code className="rounded bg-amber-100 px-1 py-0.5 text-xs">
                  STRIPE_PRICE_PRO_YEARLY
                </code>{" "}
                to{" "}
                <code className="rounded bg-amber-100 px-1 py-0.5 text-xs">
                  backend/.env
                </code>{" "}
                then restart the API. See{" "}
                <span className="font-medium">STRIPE_SETUP.md</span> in the repo.
              </p>
            </div>
          </div>
        </div>
      )}

      {!loading && stripeReady && !webhookReady && (
        <div className="mb-6 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-4 sm:px-5">
          <div className="flex gap-3">
            <AlertTriangle size={20} className="mt-0.5 shrink-0 text-sky-600" />
            <div className="min-w-0">
              <p className="font-medium text-sky-900">Webhook secret missing</p>
              <p className="mt-1 text-sm text-sky-800">
                Checkout may work, but plans won&apos;t sync until you run{" "}
                <code className="rounded bg-sky-100 px-1 py-0.5 text-xs">
                  stripe listen --forward-to localhost:5000/api/webhooks/stripe
                </code>{" "}
                and set{" "}
                <code className="rounded bg-sky-100 px-1 py-0.5 text-xs">
                  STRIPE_WEBHOOK_SECRET
                </code>
                .
              </p>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-8">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <SkeletonMetric key={index} />
            ))}
          </div>
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-zinc-400" size={32} />
          </div>
        </div>
      ) : (
        <>
          <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm">
              <p className="text-sm text-zinc-500">Current plan</p>
              <p className="mt-1 text-2xl font-semibold capitalize text-zinc-900">
                {billing?.subscriptionPlan || "free"}
                {isPro && billing?.subscriptionInterval && (
                  <span className="text-base font-normal text-zinc-500">
                    {" "}
                    · {billing.subscriptionInterval}
                  </span>
                )}
              </p>
              <p className="mt-1 text-xs capitalize text-zinc-400">
                Status: {billing?.subscriptionStatus || "inactive"}
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm">
              <p className="text-sm text-zinc-500">Generations today</p>
              <p className="mt-1 text-2xl font-semibold text-zinc-900">
                {billing?.usage?.generationsToday ?? 0}
                {billing?.usage?.dailyLimit != null && (
                  <span className="text-base font-normal text-zinc-500">
                    {" "}
                    / {billing.usage.dailyLimit}
                  </span>
                )}
                {billing?.usage?.dailyLimit == null && (
                  <span className="text-base font-normal text-zinc-500">
                    {" "}
                    · unlimited
                  </span>
                )}
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm sm:col-span-2 xl:col-span-1">
              <p className="text-sm text-zinc-500">Billing period ends</p>
              <p className="mt-1 text-lg font-semibold text-zinc-900">
                {isPro && billing?.currentPeriodEnd
                  ? formatPeriodEnd(billing.currentPeriodEnd)
                  : "—"}
              </p>
              {billing?.cancelAtPeriodEnd && (
                <p className="mt-1 text-xs text-amber-600">
                  Cancels at period end
                </p>
              )}
            </div>
          </div>

          {isPro && (
            <div className="mb-8 grid gap-3 sm:flex sm:flex-wrap">
              <button
                type="button"
                onClick={handlePortal}
                disabled={Boolean(actionLoading) || !stripeReady}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200/80 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 disabled:opacity-60 sm:w-auto"
              >
                <CreditCard size={16} />
                Manage payment method
              </button>
              {billing?.cancelAtPeriodEnd ? (
                <button
                  type="button"
                  onClick={handleResume}
                  disabled={actionLoading === "resume"}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-60 sm:w-auto"
                >
                  Resume subscription
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={actionLoading === "cancel"}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700 hover:bg-red-100 disabled:opacity-60 sm:w-auto"
                >
                  Cancel subscription
                </button>
              )}
              {billing?.subscriptionInterval === "monthly" ? (
                <button
                  type="button"
                  onClick={() => handleChangePlan("pro_yearly")}
                  disabled={actionLoading === "change-pro_yearly"}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200/80 px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-60 sm:w-auto"
                >
                  Switch to yearly
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleChangePlan("pro_monthly")}
                  disabled={actionLoading === "change-pro_monthly"}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200/80 px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-60 sm:w-auto"
                >
                  Switch to monthly
                </button>
              )}
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-2">
            <div
              className={`rounded-2xl border p-5 shadow-sm sm:p-6 ${
                !isPro
                  ? "border-indigo-600/30 ring-1 ring-indigo-600/20"
                  : "border-zinc-200/80 bg-white"
              }`}
            >
              <div className="flex items-center gap-2">
                <Zap size={20} className="text-zinc-600" />
                <h2 className="text-lg font-semibold text-zinc-900">Free</h2>
              </div>
              <p className="mt-2 text-3xl font-bold text-zinc-900">$0</p>
              <p className="text-sm text-zinc-500">Forever</p>
              <ul className="mt-6 space-y-3">
                {freeFeatures.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2 text-sm text-zinc-600"
                  >
                    <Check size={16} className="shrink-0 text-zinc-400" />
                    {f}
                  </li>
                ))}
              </ul>
              {isPro ? (
                <p className="mt-6 text-sm text-zinc-500">
                  Downgrade when your Pro period ends, or cancel below.
                </p>
              ) : (
                <p className="mt-6 text-sm font-medium text-indigo-600">
                  Your current plan
                </p>
              )}
            </div>

            <div
              className={`rounded-2xl border p-5 shadow-sm sm:p-6 ${
                isPro
                  ? "border-indigo-600 bg-gradient-to-br from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-500/20"
                  : "border-zinc-200/80 bg-white"
              }`}
            >
              <div className="flex items-center gap-2">
                <Crown
                  size={20}
                  className={isPro ? "text-amber-300" : "text-amber-600"}
                />
                <h2
                  className={`text-lg font-semibold ${
                    isPro ? "text-white" : "text-zinc-900"
                  }`}
                >
                  Pro
                </h2>
              </div>
              <p
                className={`mt-2 text-sm ${
                  isPro ? "text-indigo-100" : "text-zinc-500"
                }`}
              >
                Unlimited power for builders
              </p>
              <ul className="mt-6 space-y-3">
                {proFeatures.map((f) => (
                  <li
                    key={f}
                    className={`flex items-center gap-2 text-sm ${
                      isPro ? "text-indigo-50" : "text-zinc-600"
                    }`}
                  >
                    <Check
                      size={16}
                      className={`shrink-0 ${
                        isPro ? "text-amber-300" : "text-indigo-600"
                      }`}
                    />
                    {f}
                  </li>
                ))}
              </ul>

              {isPro ? (
                <p className="mt-6 text-sm text-amber-200">You&apos;re on Pro</p>
              ) : (
                <div className="mt-6 space-y-3">
                  <button
                    type="button"
                    onClick={() => handleCheckout("pro_monthly")}
                    disabled={Boolean(actionLoading) || !stripeReady}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
                  >
                    {actionLoading?.startsWith("checkout") ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <>
                        Pro Monthly — $19/mo
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCheckout("pro_yearly")}
                    disabled={Boolean(actionLoading) || !stripeReady}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-indigo-200 py-3 text-sm font-semibold text-indigo-700 hover:bg-indigo-50 disabled:opacity-60"
                  >
                    Pro Yearly — save with annual billing
                  </button>
                </div>
              )}
            </div>
          </div>

          <p className="mt-8 flex flex-col items-center gap-2 text-center text-sm text-zinc-500 sm:flex-row sm:justify-center sm:gap-3">
            <span className="inline-flex items-center gap-1">
              Payments secured by{" "}
              <a
                href="https://stripe.com"
                className="inline-flex items-center gap-0.5 font-medium text-zinc-700 underline hover:text-zinc-900"
                target="_blank"
                rel="noreferrer"
              >
                Stripe
                <ExternalLink size={12} />
              </a>
            </span>
            <span className="hidden sm:inline">·</span>
            <Link to="/generate" className="font-medium text-indigo-600 hover:text-indigo-500">
              Back to generate
            </Link>
          </p>
        </>
      )}
    </DashboardLayout>
  );
};

export default Billing;
