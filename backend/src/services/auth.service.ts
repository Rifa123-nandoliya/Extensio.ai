import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import User from "../models/user.model";
import { AppError } from "../utils/AppError";
import { getJwtSecret, JWT_EXPIRES_IN } from "../config/jwt";
import { LoginInput, RegisterInput } from "../schemas/auth.schema";
import { createPersonalWorkspace, listUserWorkspaces } from "./workspace.service";
import {
  applyReferralOnSignup,
  ensureUserReferralCode,
} from "./referral.service";
import { generateReferralCode } from "./usageTracking.service";

const SALT_ROUNDS = 12;

export interface JwtPayload {
  userId: string;
}

export interface SafeUser {
  id: string;
  name: string;
  email: string;
  role: string;
  subscriptionPlan: string;
  subscriptionInterval: string | null;
  subscriptionStatus: string;
  referralCode: string | null;
  activeWorkspaceId: string | null;
}

const toSafeUser = (user: {
  _id: { toString(): string };
  name: string;
  email: string;
  role: string;
  subscriptionPlan: string;
  subscriptionInterval?: string | null;
  subscriptionStatus?: string;
  referralCode?: string | null;
  activeWorkspaceId?: string | null;
}): SafeUser => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
  subscriptionPlan: user.subscriptionPlan,
  subscriptionInterval: user.subscriptionInterval ?? null,
  subscriptionStatus: user.subscriptionStatus ?? "inactive",
  referralCode: user.referralCode ?? null,
  activeWorkspaceId: user.activeWorkspaceId ?? null,
});

const createUniqueReferralCode = async (): Promise<string> => {
  let code = generateReferralCode();
  while (await User.exists({ referralCode: code })) {
    code = generateReferralCode();
  }
  return code;
};

export const registerUser = async (
  input: RegisterInput & { referralCode?: string }
) => {
  const existing = await User.findOne({ email: input.email });
  if (existing) {
    throw new AppError("Email is already registered", 409);
  }

  const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);
  const referralCode = await createUniqueReferralCode();

  const user = await User.create({
    name: input.name,
    email: input.email,
    password: hashedPassword,
    role: "user",
    subscriptionPlan: "free",
    referralCode,
  });

  await createPersonalWorkspace(user._id.toString(), user.name);
  await applyReferralOnSignup(user._id.toString(), input.referralCode);

  const refreshed = await User.findById(user._id);
  return toSafeUser(refreshed ?? user);
};

export const loginUser = async (input: LoginInput) => {
  const user = await User.findOne({ email: input.email }).select("+password");

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isMatch = await bcrypt.compare(input.password, user.password);
  if (!isMatch) {
    throw new AppError("Invalid email or password", 401);
  }

  if (!user.referralCode) {
    user.referralCode = await ensureUserReferralCode(user._id.toString());
  }

  if (!user.activeWorkspaceId) {
    const workspaces = await listUserWorkspaces(user._id.toString());
    if (!workspaces.length) {
      await createPersonalWorkspace(user._id.toString(), user.name);
    } else {
      user.activeWorkspaceId = workspaces[0]!.workspaceId;
      await user.save();
    }
  }

  const refreshed = await User.findById(user._id);
  return toSafeUser(refreshed ?? user);
};

export const getUserById = async (userId: string): Promise<SafeUser | null> => {
  const user = await User.findById(userId);
  if (!user) return null;
  return toSafeUser(user);
};

export const signToken = (userId: string): string => {
  const options: SignOptions = {
    expiresIn: (JWT_EXPIRES_IN || "7d") as SignOptions["expiresIn"],
  };
  return jwt.sign({ userId }, getJwtSecret(), options);
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, getJwtSecret()) as JwtPayload;
};
