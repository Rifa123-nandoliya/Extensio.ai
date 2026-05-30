import { v4 as uuidv4 } from "uuid";
import User from "../models/user.model";
import Referral from "../models/referral.model";
import { AppError } from "../utils/AppError";
import { generateReferralCode, recordUsageEvent } from "./usageTracking.service";

export const ensureUserReferralCode = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.referralCode) {
    return user.referralCode;
  }

  let code = generateReferralCode();
  while (await User.exists({ referralCode: code })) {
    code = generateReferralCode();
  }

  user.referralCode = code;
  await user.save();
  return code;
};

export const applyReferralOnSignup = async (
  newUserId: string,
  referralCode?: string
) => {
  if (!referralCode?.trim()) return null;

  const referrer = await User.findOne({
    referralCode: referralCode.trim().toLowerCase(),
  });

  if (!referrer || referrer._id.toString() === newUserId) {
    return null;
  }

  const referredUser = await User.findById(newUserId);
  if (!referredUser) return null;

  referredUser.referredBy = referrer._id.toString();
  await referredUser.save();

  const referral = await Referral.create({
    referralCode: referralCode.trim().toLowerCase(),
    referrerId: referrer._id.toString(),
    referredUserId: newUserId,
    status: "completed",
    completedAt: new Date(),
  });

  await recordUsageEvent({
    userId: referrer._id.toString(),
    eventType: "referral_signup",
    metadata: { referredUserId: newUserId },
  });

  return referral;
};

export const getReferralStats = async (userId: string) => {
  const code = await ensureUserReferralCode(userId);

  const referrals = await Referral.find({ referrerId: userId }).sort({
    createdAt: -1,
  });

  return {
    referralCode: code,
    referralLink: `/register?ref=${code}`,
    totalReferrals: referrals.length,
    referrals: referrals.map((r) => ({
      referredUserId: r.referredUserId,
      status: r.status,
      completedAt: r.completedAt,
      createdAt: r.createdAt,
    })),
  };
};
