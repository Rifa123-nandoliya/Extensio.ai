import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    subscriptionPlan: {
      type: String,
      enum: ["free", "pro"],
      default: "free",
    },
    subscriptionInterval: {
      type: String,
      enum: ["monthly", "yearly", null],
      default: null,
    },
    subscriptionStatus: {
      type: String,
      enum: [
        "active",
        "trialing",
        "past_due",
        "canceled",
        "incomplete",
        "inactive",
      ],
      default: "inactive",
    },
    stripeCustomerId: {
      type: String,
      default: null,
      sparse: true,
    },
    stripeSubscriptionId: {
      type: String,
      default: null,
      sparse: true,
    },
    generationUsageDate: {
      type: String,
      default: null,
    },
    generationUsageCount: {
      type: Number,
      default: 0,
    },
    referralCode: {
      type: String,
      unique: true,
      sparse: true,
    },
    referredBy: {
      type: String,
      default: null,
    },
    activeWorkspaceId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
