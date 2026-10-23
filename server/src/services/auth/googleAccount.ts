import User from "../../models/userModel.js";
import type { OauthLocale, GoogleIdentity } from "./googleOAuth.js";
import type { UserDocument } from "../../types/user.types.js";

export type GoogleAccountResult =
  | { status: "ready"; user: UserDocument }
  | { status: "conflict" };

function duplicateField(error: unknown): string | null {
  if (typeof error !== "object" || error === null || !("code" in error)) return null;
  if ((error as { code: unknown }).code !== 11000) return null;

  const pattern = (error as { keyPattern?: Record<string, unknown> }).keyPattern;
  const field = pattern ? Object.keys(pattern)[0] : undefined;
  return field ?? "unknown";
}

export async function findOrCreateGoogleUser(
  identity: GoogleIdentity,
  locale: OauthLocale,
): Promise<GoogleAccountResult> {
  const bySub = await User.findOne({ googleSub: identity.sub });
  if (bySub) return { status: "ready", user: bySub };

  const byEmail = await User.findOne({ email: identity.email });
  if (byEmail) return { status: "conflict" };

  try {
    const user = await User.create({
      email: identity.email,
      firstName: identity.firstName,
      lastName: identity.lastName,
      googleSub: identity.sub,
      authProviders: ["google"],
      isEmailVerified: true,
      language: locale,
      role: "user",
    });

    return { status: "ready", user };
  } catch (error) {
    const field = duplicateField(error);
    if (!field) throw error;

    if (field === "googleSub" || field === "unknown") {
      const winner = await User.findOne({ googleSub: identity.sub });
      if (winner) return { status: "ready", user: winner };
    }

    if (field === "email" || field === "unknown") {
      return { status: "conflict" };
    }

    throw error;
  }
}
