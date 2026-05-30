import mongoose from "mongoose";

const referralSchema = new mongoose.Schema(
  {
    referralCode: {
      type: String,
      required: true,
      index: true,
    },
    referrerId: {
      type: String,
      required: true,
      index: true,
    },
    referredUserId: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "rewarded"],
      default: "completed",
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Referral", referralSchema);
