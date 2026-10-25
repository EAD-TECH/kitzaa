import bcrypt from "bcrypt";
import type { AuthProvider } from "../types/user.types.js";

type CredentialState = {
  googleSub?: string | null;
  authProviders?: AuthProvider[] | null;
  password?: string;
  passwordResetToken?: string | null;
  passwordResetExp?: Date | null;
  refreshToken?: string | null;
  isNew?: boolean;
};

export function hasGoogleIdentity(googleSub: string | null | undefined): boolean {
  return typeof googleSub === "string" && googleSub.length > 0;
}

export function hasPasswordSecret(
  password: string | null | undefined,
): password is string {
  return typeof password === "string" && password.length > 0;
}

export function syncAuthProvidersForNewUser(user: CredentialState): void {
  if (!user.isNew) return;

  const next = new Set<AuthProvider>(user.authProviders ?? []);

  if (hasPasswordSecret(user.password)) next.add("password");
  if (hasGoogleIdentity(user.googleSub)) next.add("google");

  if (next.size > 0) {
    user.authProviders = [...next];
  }
}

// Adds password login without removing an existing Google identity.
export function grantPasswordLogin(user: CredentialState): void {
  const next = new Set<AuthProvider>(user.authProviders ?? []);
  next.add("password");

  if (hasGoogleIdentity(user.googleSub)) next.add("google");

  user.authProviders = [...next];
}

export function applyPasswordReset(user: CredentialState, newPassword: string): void {
  const googleSub = user.googleSub;

  user.password = newPassword;
  user.passwordResetToken = null;
  user.passwordResetExp = null;
  user.refreshToken = null;
  grantPasswordLogin(user);
  user.googleSub = googleSub ?? undefined;
}

export async function hashPasswordIfNeeded(
  password: string | undefined,
  isModified: boolean,
): Promise<string | undefined> {
  if (!isModified) return password;
  if (!hasPasswordSecret(password)) return undefined;
  const hashed = await bcrypt.hash(password, 12);
  return hashed;
}
