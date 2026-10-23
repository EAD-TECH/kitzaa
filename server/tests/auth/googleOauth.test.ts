jest.mock("google-auth-library", () => {
  const verifyIdToken = jest.fn();
  const OAuth2Client = Object.assign(
    jest.fn().mockImplementation(() => ({ verifyIdToken })),
    { verifyIdToken },
  );
  return { OAuth2Client };
});

import jwt from "jsonwebtoken";
import { generateAccessToken } from "../../src/helpers/generateJwt.js";
import { isProfileComplete } from "../../src/helpers/profileCompletion.js";
import requireCompleteProfile from "../../src/middlewares/requireCompleteProfile.js";
import {
  googleNonceCookieOptions,
  GoogleAuthError,
  isAllowedGoogleOrigin,
  verifyGoogleIdToken,
} from "../../src/services/auth/googleOAuth.js";
import {
  matchingPlace,
  resolveGermanAddress,
} from "../../src/services/auth/germanPostalCode.js";
import type { Request, Response, NextFunction } from "express";
import { OAuth2Client } from "google-auth-library";

const verifyIdToken = (OAuth2Client as unknown as { verifyIdToken: jest.Mock }).verifyIdToken;

beforeAll(() => {
  process.env.ACCESS_KEY = "test-access-key";
  process.env.REFRESH_KEY = "test-refresh-key";
  process.env.GOOGLE_CLIENT_ID = "test-client-id";
  delete process.env.GOOGLE_CLIENT_SECRET;
  delete process.env.GOOGLE_REDIRECT_URI;
  process.env.CLIENT_URL = "http://localhost:3000";
  process.env.NODE_ENV = "test";
});

beforeEach(() => {
  verifyIdToken.mockReset();
});

function payload(overrides: Record<string, unknown> = {}) {
  return {
    sub: "google-sub-1",
    email: "Ada@Gmail.com",
    email_verified: true,
    given_name: "Ada",
    family_name: "Lovelace",
    nonce: "nonce-1",
    iss: "https://accounts.google.com",
    aud: "test-client-id",
    ...overrides,
  };
}

describe("Google ID token", () => {
  test("resmi istemci audience ile cagrilir ve kimlik eslenir", async () => {
    verifyIdToken.mockResolvedValue({ getPayload: () => payload() });

    await expect(verifyGoogleIdToken("id-token", "nonce-1")).resolves.toEqual({
      sub: "google-sub-1",
      email: "ada@gmail.com",
      firstName: "Ada",
      lastName: "Lovelace",
    });

    expect(verifyIdToken).toHaveBeenCalledWith({
      idToken: "id-token",
      audience: "test-client-id",
    });
    expect(JSON.stringify(verifyIdToken.mock.calls)).not.toContain("client_secret");
  });

  test("sure, issuer veya audience hatasi exchange olur", async () => {
    verifyIdToken.mockRejectedValue(new Error("Token used too late"));

    await expect(verifyGoogleIdToken("expired", "nonce-1")).rejects.toMatchObject({
      code: "oauth_exchange",
    });
  });

  test("nonce ve email_verified tutulur", async () => {
    verifyIdToken.mockResolvedValueOnce({
      getPayload: () => payload({ nonce: "other" }),
    });
    await expect(verifyGoogleIdToken("id-token", "nonce-1")).rejects.toMatchObject({
      code: "oauth_state",
    });

    verifyIdToken.mockResolvedValueOnce({
      getPayload: () => payload({ email_verified: false }),
    });
    await expect(verifyGoogleIdToken("id-token", "nonce-1")).rejects.toBeInstanceOf(
      GoogleAuthError,
    );
  });

  test("izinli origin client ve localhost ile sinirlidir", () => {
    expect(isAllowedGoogleOrigin("http://localhost:3000")).toBe(true);
    expect(isAllowedGoogleOrigin("http://localhost:3000/")).toBe(true);
    expect(isAllowedGoogleOrigin(undefined)).toBe(false);
    expect(isAllowedGoogleOrigin("http://evil.example")).toBe(false);
    expect(isAllowedGoogleOrigin("http://localhost:3001")).toBe(false);
  });

  test("production localhost kabul etmez ve gecersiz CLIENT_URL icin fallback yapmaz", () => {
    const previousEnv = process.env.NODE_ENV;
    const previousClient = process.env.CLIENT_URL;
    const previousAdmin = process.env.ADMIN_URL;
    const error = jest.spyOn(console, "error").mockImplementation(() => undefined);

    process.env.NODE_ENV = "production";
    process.env.CLIENT_URL = "https://kitzaa.de/";
    process.env.ADMIN_URL = "https://admin.kitzaa.de";

    try {
      expect(isAllowedGoogleOrigin("https://kitzaa.de")).toBe(true);
      expect(isAllowedGoogleOrigin("https://admin.kitzaa.de")).toBe(true);
      expect(isAllowedGoogleOrigin("http://localhost:3000")).toBe(false);

      process.env.CLIENT_URL = "https://kitzaa.de/app";
      expect(isAllowedGoogleOrigin("http://localhost:3000")).toBe(false);
      expect(isAllowedGoogleOrigin("https://kitzaa.de")).toBe(false);
      expect(String(error.mock.calls[0]?.[0])).toContain("CLIENT_URL");
    } finally {
      process.env.NODE_ENV = previousEnv;
      process.env.CLIENT_URL = previousClient;
      if (previousAdmin === undefined) delete process.env.ADMIN_URL;
      else process.env.ADMIN_URL = previousAdmin;
      error.mockRestore();
    }
  });

  test("nonce cerezi localhostta lax, productionda none ve secure olur", () => {
    expect(googleNonceCookieOptions()).toMatchObject({
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/api/v1/auth/google",
    });

    process.env.NODE_ENV = "production";
    try {
      expect(googleNonceCookieOptions()).toMatchObject({
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
    } finally {
      process.env.NODE_ENV = "test";
    }
  });

  test("kullanici adi olmayan hesap icin access token uretilebilir", () => {
    const token = generateAccessToken({
      _id: "user-id",
      username: undefined,
      isActive: true,
      role: "user",
    } as never);

    const decoded = jwt.verify(token, process.env.ACCESS_KEY!) as { username: string };
    expect(decoded.username).toBe("");
  });
});

describe("profil ve posta kodu", () => {
  test("eksik profil tamamlanmis sayilmaz", () => {
    expect(isProfileComplete({ username: undefined, location: undefined })).toBe(false);
    expect(
      isProfileComplete({
        username: "ada",
        location: { zipCode: "10115", city: "Berlin", state: "Berlin" },
      }),
    ).toBe(true);
  });

  test("eksik profil middleware 403 verir", () => {
    const next = jest.fn();
    expect(() =>
      requireCompleteProfile(
        { user: { username: undefined } } as Request,
        {} as Response,
        next as NextFunction,
      ),
    ).toThrow("Profile is incomplete.");
    expect(next).not.toHaveBeenCalled();
  });

  test("posta kodu sehir ve eyalet birlikte tutmazsa reddedilir", async () => {
    expect(
      matchingPlace(
        { city: "berlin", state: "Berlin" },
        [{ "place name": "Berlin", state: "Berlin" }],
      ),
    ).toEqual({ city: "Berlin", state: "Berlin" });

    const fetchImpl = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ places: [{ "place name": "Berlin", state: "Berlin" }] }),
    });

    await expect(
      resolveGermanAddress(
        { postalCode: "10115", city: "Hamburg", state: "Hamburg" },
        fetchImpl as unknown as typeof fetch,
      ),
    ).rejects.toMatchObject({ statusCode: 400 });
  });
});
