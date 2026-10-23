import type { Request, Response } from "express";
import CustomError from "../../helpers/customError.js";
import { isProfileComplete } from "../../helpers/profileCompletion.js";
import { generateAccessToken, generateRefreshToken } from "../../helpers/generateJwt.js";
import { toUserDTO } from "../../helpers/toUserDTO.js";
import User from "../../models/userModel.js";
import { findOrCreateGoogleUser } from "../../services/auth/googleAccount.js";
import { resolveGermanAddress } from "../../services/auth/germanPostalCode.js";
import {
  GOOGLE_NONCE_COOKIE,
  GoogleAuthError,
  googleNonceClearOptions,
  googleNonceCookieOptions,
  isAllowedGoogleOrigin,
  randomUrlSafe,
  verifyGoogleIdToken,
  type OauthLocale,
} from "../../services/auth/googleOAuth.js";
import type { CompleteProfileInput, GoogleSignInInput } from "../../validations/user.schema.js";
import { refreshCookieOptions } from "./authController.js";

function duplicateField(error: unknown): string | null {
  if (typeof error !== "object" || error === null || !("code" in error)) return null;
  if ((error as { code: unknown }).code !== 11000) return null;
  const pattern = (error as { keyPattern?: Record<string, unknown> }).keyPattern;
  return pattern ? (Object.keys(pattern)[0] ?? "unknown") : "unknown";
}

function clearNonce(res: Response): void {
  res.clearCookie(GOOGLE_NONCE_COOKIE, googleNonceClearOptions());
}

function rejectGoogleFailure(error: unknown): never {
  if (error instanceof GoogleAuthError) {
    throw new CustomError(error.code, 401);
  }

  console.error("Google sign-in failed", error instanceof Error ? error.name : "Error");
  throw new CustomError("oauth_exchange", 401);
}

const googleAuthController = {
  issueNonce: async (req: Request, res: Response) => {
    if (!isAllowedGoogleOrigin(req.get("origin"))) {
      throw new CustomError("oauth_state", 401);
    }

    const nonce = randomUrlSafe(32);
    res.cookie(GOOGLE_NONCE_COOKIE, nonce, googleNonceCookieOptions());
    res.status(200).send({ error: false, nonce });
  },

  signIn: async (req: Request<{}, unknown, GoogleSignInInput>, res: Response) => {
    if (!isAllowedGoogleOrigin(req.get("origin"))) {
      clearNonce(res);
      throw new CustomError("oauth_state", 401);
    }

    const nonce = typeof req.cookies?.[GOOGLE_NONCE_COOKIE] === "string"
      ? req.cookies[GOOGLE_NONCE_COOKIE]
      : "";
    clearNonce(res);

    if (!nonce) throw new CustomError("oauth_state", 401);

    const locale: OauthLocale = req.body.locale === "en" ? "en" : "de";

    let identity;
    try {
      identity = await verifyGoogleIdToken(req.body.credential, nonce);
    } catch (error) {
      rejectGoogleFailure(error);
    }

    const account = await findOrCreateGoogleUser(identity, locale);

    if (account.status === "conflict") {
      throw new CustomError("oauth_use_password", 409);
    }

    if (!account.user.isActive) {
      throw new CustomError("oauth_inactive", 403);
    }

    const refreshToken = generateRefreshToken(account.user);
    account.user.refreshToken = refreshToken;
    await account.user.save();

    res.cookie("refreshToken", refreshToken, refreshCookieOptions());
    res.status(200).send({
      error: false,
      accessToken: generateAccessToken(account.user),
      user: toUserDTO(account.user),
    });
  },

  completeProfile: async (
    req: Request<{}, unknown, CompleteProfileInput>,
    res: Response,
  ) => {
    const user = await User.findById(req.user._id);
    if (!user || !user.isActive) throw new CustomError("User not found", 401);

    if (isProfileComplete(user)) {
      res.status(200).send({
        error: false,
        accessToken: generateAccessToken(user),
        user: toUserDTO(user),
      });
      return;
    }

    const { username, postalCode, city, state } = req.body;
    const taken = await User.exists({ username, _id: { $ne: user._id } });
    if (taken) throw new CustomError("Username is already taken.", 409);

    const address = await resolveGermanAddress({ postalCode, city, state });

    user.username = username;
    user.location = {
      zipCode: address.zipCode,
      city: address.city,
      state: address.state,
      country: "DE",
      district: null,
    };

    try {
      await user.save();
    } catch (error) {
      if (duplicateField(error)) {
        throw new CustomError("Username is already taken.", 409);
      }
      throw error;
    }

    res.status(200).send({
      error: false,
      accessToken: generateAccessToken(user),
      user: toUserDTO(user),
    });
  },
};

export default googleAuthController;
