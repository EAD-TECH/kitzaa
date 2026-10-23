import crypto from "crypto";
import type { CookieOptions } from "express";
import { OAuth2Client } from "google-auth-library";

const NONCE_TTL_MS = 10 * 60 * 1000;
const LOCAL_CLIENT_ORIGIN = "http://localhost:3000";
const LOCAL_BROWSER_ORIGINS = [LOCAL_CLIENT_ORIGIN, "http://localhost:3001"];

export const GOOGLE_NONCE_COOKIE = "google_nonce";

export class GoogleAuthError extends Error {
  code: "oauth_exchange" | "oauth_email_unverified" | "oauth_state";

  constructor(code: GoogleAuthError["code"]) {
    super(code);
    this.name = "GoogleAuthError";
    this.code = code;
  }
}

export type OauthLocale = "de" | "en";

export type GoogleIdentity = {
  sub: string;
  email: string;
  firstName: string;
  lastName: string;
};

export function randomUrlSafe(bytes = 32): string {
  return crypto.randomBytes(bytes).toString("base64url");
}

function safeEqual(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  if (leftBuffer.length !== rightBuffer.length) return false;
  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

export function parseOrigin(value: string | undefined): string | null {
  if (!value?.trim()) return null;

  let url: URL;
  try {
    url = new URL(value.trim());
  } catch {
    return null;
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") return null;
  if (url.username || url.password || url.search || url.hash) return null;
  if (url.pathname !== "/" && url.pathname !== "") return null;

  return url.origin;
}

function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

export function productionFrontendOrigins(): string[] {
  const client = parseOrigin(process.env.CLIENT_URL);
  if (!client) {
    throw new Error(
      "CLIENT_URL is missing or not a valid http(s) origin. Production does not fall back to localhost.",
    );
  }

  if (!process.env.ADMIN_URL?.trim()) return [client];

  const admin = parseOrigin(process.env.ADMIN_URL);
  if (!admin) {
    throw new Error(
      "ADMIN_URL is not a valid http(s) origin. Production does not fall back to localhost.",
    );
  }

  return [client, admin];
}

export function browserCorsOrigins(): string[] {
  if (isProduction()) return productionFrontendOrigins();

  return [...new Set(
    [parseOrigin(process.env.CLIENT_URL), parseOrigin(process.env.ADMIN_URL), ...LOCAL_BROWSER_ORIGINS]
      .filter((origin): origin is string => origin !== null),
  )];
}

let productionOriginReported = false;

export function isAllowedGoogleOrigin(origin: string | undefined): boolean {
  const requestOrigin = parseOrigin(origin);
  if (!requestOrigin) return false;

  if (!isProduction()) {
    const client = parseOrigin(process.env.CLIENT_URL);
    return requestOrigin === LOCAL_CLIENT_ORIGIN || requestOrigin === client;
  }

  try {
    return productionFrontendOrigins().includes(requestOrigin);
  } catch (error) {
    if (!productionOriginReported) {
      productionOriginReported = true;
      console.error(error instanceof Error ? error.message : "Invalid production origin configuration.");
    }
    return false;
  }
}

export function googleNonceCookieOptions(): CookieOptions {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/api/v1/auth/google",
    maxAge: NONCE_TTL_MS,
  };
}

export function googleNonceClearOptions(): Pick<
  CookieOptions,
  "httpOnly" | "secure" | "sameSite" | "path"
> {
  const { maxAge: _maxAge, ...base } = googleNonceCookieOptions();
  return base;
}

function displayName(value: unknown, fallback: string): string {
  const trimmed = typeof value === "string" ? value.trim() : "";
  return (trimmed || fallback).slice(0, 50);
}

export async function verifyGoogleIdToken(
  idToken: string,
  nonce: string,
): Promise<GoogleIdentity> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) throw new GoogleAuthError("oauth_exchange");

  // audience, exp, and issuer are enforced by the official client.
  let payload;
  try {
    const ticket = await new OAuth2Client().verifyIdToken({
      idToken,
      audience: clientId,
    });
    payload = ticket.getPayload();
  } catch {
    throw new GoogleAuthError("oauth_exchange");
  }

  if (!payload) throw new GoogleAuthError("oauth_exchange");

  if (typeof payload.nonce !== "string" || !safeEqual(payload.nonce, nonce)) {
    throw new GoogleAuthError("oauth_state");
  }

  if (payload.email_verified !== true) {
    throw new GoogleAuthError("oauth_email_unverified");
  }

  if (payload.sub.length === 0 || typeof payload.email !== "string" || payload.email.length === 0) {
    throw new GoogleAuthError("oauth_exchange");
  }

  return {
    sub: payload.sub,
    email: payload.email.toLowerCase(),
    firstName: displayName(payload.given_name, "User"),
    lastName: displayName(payload.family_name, "-"),
  };
}
