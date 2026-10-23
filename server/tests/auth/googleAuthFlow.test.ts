import type { Request, Response } from "express";
import jwt from "jsonwebtoken";

const findOne = jest.fn();
const create = jest.fn();
const findById = jest.fn();
const exists = jest.fn();

jest.mock("google-auth-library", () => ({
  OAuth2Client: jest.fn().mockImplementation(() => ({
    verifyIdToken: jest.fn(),
  })),
}));

jest.mock("../../src/models/userModel.js", () => ({
  __esModule: true,
  default: {
    findOne: (...args: unknown[]) => findOne(...args),
    create: (...args: unknown[]) => create(...args),
    findById: (...args: unknown[]) => findById(...args),
    exists: (...args: unknown[]) => exists(...args),
  },
}));

jest.mock("../../src/services/auth/googleOAuth.js", () => {
  const actual = jest.requireActual("../../src/services/auth/googleOAuth.js");
  return {
    ...actual,
    verifyGoogleIdToken: jest.fn(),
  };
});

jest.mock("../../src/services/auth/germanPostalCode.js", () => ({
  resolveGermanAddress: jest.fn(),
}));

import googleAuthController from "../../src/controllers/auth/googleAuthController.js";
import {
  GOOGLE_NONCE_COOKIE,
  verifyGoogleIdToken,
} from "../../src/services/auth/googleOAuth.js";
import { resolveGermanAddress } from "../../src/services/auth/germanPostalCode.js";
import { socketAuth } from "../../src/sockets/middleware/socketAuth.js";

beforeAll(() => {
  process.env.ACCESS_KEY = "test-access-key";
  process.env.REFRESH_KEY = "test-refresh-key";
  process.env.GOOGLE_CLIENT_ID = "test-client-id";
  delete process.env.GOOGLE_CLIENT_SECRET;
  process.env.CLIENT_URL = "http://localhost:3000";
  process.env.NODE_ENV = "test";
});

beforeEach(() => {
  findOne.mockReset();
  create.mockReset();
  findById.mockReset();
  exists.mockReset();
  verifyGoogleIdToken.mockReset();
  resolveGermanAddress.mockReset();
});

function mockRes() {
  const res = {
    status: jest.fn(),
    send: jest.fn(),
    cookie: jest.fn(),
    clearCookie: jest.fn(),
    headersSent: false,
  };
  res.status.mockReturnValue(res);
  res.send.mockReturnValue(res);
  return res as unknown as Response & typeof res;
}

function googleUser(overrides: Record<string, unknown> = {}) {
  return {
    _id: "user-id",
    email: "ada@gmail.com",
    firstName: "Ada",
    lastName: "Lovelace",
    googleSub: "google-sub-1",
    username: undefined,
    location: undefined,
    isActive: true,
    role: "user",
    language: "de",
    phone: null,
    avatarUrl: null,
    isEmailVerified: true,
    savedEvents: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    refreshToken: null,
    save: jest.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

const identity = {
  sub: "google-sub-1",
  email: "ada@gmail.com",
  firstName: "Ada",
  lastName: "Lovelace",
};

function signInRequest(
  body: { credential: string; locale?: "de" | "en" },
  options?: { origin?: string | undefined; nonce?: string | null },
) {
  const origin = options && "origin" in options ? options.origin : "http://localhost:3000";
  const nonce = options && "nonce" in options ? options.nonce : "nonce-1";

  return {
    body,
    cookies: nonce ? { [GOOGLE_NONCE_COOKIE]: nonce } : {},
    get(name: string) {
      return name.toLowerCase() === "origin" ? origin : undefined;
    },
  } as unknown as Request;
}

describe("Google sign-in", () => {
  test("nonce uretir ve httpOnly cereze yazar", async () => {
    const res = mockRes();

    await googleAuthController.issueNonce(
      signInRequest({ credential: "unused" }),
      res,
    );

    const cookie = res.cookie.mock.calls[0];
    const body = res.send.mock.calls[0][0] as { nonce: string };
    expect(cookie[0]).toBe(GOOGLE_NONCE_COOKIE);
    expect(cookie[1]).toBe(body.nonce);
    expect(cookie[2]).toMatchObject({
      httpOnly: true,
      sameSite: "lax",
      path: "/api/v1/auth/google",
    });
  });

  test("yeni kullanici json oturum alir ve profil tamamlanmis degildir", async () => {
    const created = googleUser();
    findOne.mockResolvedValue(null);
    create.mockResolvedValue(created);
    verifyGoogleIdToken.mockResolvedValue(identity);
    const res = mockRes();

    await googleAuthController.signIn(
      signInRequest({ credential: "id-token", locale: "de" }),
      res,
    );

    expect(verifyGoogleIdToken).toHaveBeenCalledWith("id-token", "nonce-1");
    expect(create).toHaveBeenCalledWith(expect.objectContaining({
      googleSub: "google-sub-1",
      email: "ada@gmail.com",
      authProviders: ["google"],
      isEmailVerified: true,
    }));
    expect(created.save).toHaveBeenCalled();
    expect(res.clearCookie).toHaveBeenCalledWith(
      GOOGLE_NONCE_COOKIE,
      expect.objectContaining({ path: "/api/v1/auth/google" }),
    );
    expect(res.cookie).toHaveBeenCalledWith(
      "refreshToken",
      expect.any(String),
      expect.objectContaining({ httpOnly: true, sameSite: "lax" }),
    );
    expect(res.status).toHaveBeenCalledWith(200);
    const body = res.send.mock.calls[0][0] as {
      accessToken: string;
      user: { profileCompleted: boolean };
    };
    expect(body.user.profileCompleted).toBe(false);
    expect(body.accessToken).toEqual(expect.any(String));
    expect(JSON.stringify(body)).not.toContain("id-token");
  });

  test("profili tamam kullanici ayni json oturumunu alir", async () => {
    const existing = googleUser({
      username: "ada",
      location: { zipCode: "10115", city: "Berlin", state: "Berlin", country: "DE" },
    });
    findOne.mockImplementation(async (filter: { googleSub?: string }) =>
      filter.googleSub ? existing : null,
    );
    verifyGoogleIdToken.mockResolvedValue(identity);
    const res = mockRes();

    await googleAuthController.signIn(
      signInRequest({ credential: "id-token" }),
      res,
    );

    expect(create).not.toHaveBeenCalled();
    const body = res.send.mock.calls[0][0] as { user: { profileCompleted: boolean } };
    expect(body.user.profileCompleted).toBe(true);
  });

  test("ayni e-postali sifre hesabi birlestirilmez", async () => {
    const passwordAccount = googleUser({ googleSub: undefined, save: jest.fn() });
    findOne.mockImplementation(async (filter: { googleSub?: string; email?: string }) => {
      if (filter.googleSub) return null;
      if (filter.email) return passwordAccount;
      return null;
    });
    verifyGoogleIdToken.mockResolvedValue({ ...identity, sub: "google-sub-new" });
    const res = mockRes();

    await expect(
      googleAuthController.signIn(signInRequest({ credential: "id-token" }), res),
    ).rejects.toMatchObject({ statusCode: 409, message: "oauth_use_password" });

    expect(create).not.toHaveBeenCalled();
    expect(passwordAccount.save).not.toHaveBeenCalled();
    expect(passwordAccount.googleSub).toBeUndefined();
    expect(res.cookie).not.toHaveBeenCalledWith(
      "refreshToken",
      expect.anything(),
      expect.anything(),
    );
  });

  test("origin veya nonce yoksa Google dogrulanmaz", async () => {
    const res = mockRes();

    await expect(
      googleAuthController.signIn(
        signInRequest({ credential: "id-token" }, { origin: "http://evil.example" }),
        res,
      ),
    ).rejects.toMatchObject({ statusCode: 401, message: "oauth_state" });

    await expect(
      googleAuthController.signIn(
        signInRequest({ credential: "id-token" }, { nonce: null }),
        res,
      ),
    ).rejects.toMatchObject({ statusCode: 401, message: "oauth_state" });

    expect(verifyGoogleIdToken).not.toHaveBeenCalled();
    expect(create).not.toHaveBeenCalled();
  });

  test("kapali hesap ve eszamanli cift kayit", async () => {
    const inactive = googleUser({ isActive: false });
    findOne.mockResolvedValue(inactive);
    verifyGoogleIdToken.mockResolvedValue(identity);
    const inactiveRes = mockRes();

    await expect(
      googleAuthController.signIn(signInRequest({ credential: "id-token" }), inactiveRes),
    ).rejects.toMatchObject({ statusCode: 403, message: "oauth_inactive" });
    expect(inactive.save).not.toHaveBeenCalled();

    const winner = googleUser();
    findOne
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(winner);
    create.mockRejectedValue({ code: 11000, keyPattern: { googleSub: 1 } });
    const res = mockRes();

    await googleAuthController.signIn(
      signInRequest({ credential: "id-token", locale: "en" }),
      res,
    );

    expect(create).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});

describe("complete-profile", () => {
  test("dogrulanmis adres ve benzersiz kullanici adi kaydedilir", async () => {
    const user = googleUser();
    findById.mockResolvedValue(user);
    exists.mockResolvedValue(null);
    resolveGermanAddress.mockResolvedValue({
      zipCode: "10115",
      city: "Berlin",
      state: "Berlin",
    });
    const res = mockRes();

    await googleAuthController.completeProfile(
      {
        user: { _id: "user-id" },
        body: { username: "ada", postalCode: "10115", city: "berlin", state: "Berlin" },
      } as unknown as Request,
      res,
    );

    expect(user.username).toBe("ada");
    expect(user.location).toMatchObject({ zipCode: "10115", city: "Berlin", state: "Berlin" });
    expect(res.status).toHaveBeenCalledWith(200);
    const body = res.send.mock.calls[0][0] as { accessToken: string; user: { profileCompleted: boolean } };
    expect(body.user.profileCompleted).toBe(true);
    expect(body.accessToken).toEqual(expect.any(String));
  });

  test("uyusmayan adres ve dolu kullanici adi reddedilir", async () => {
    const user = googleUser();
    findById.mockResolvedValue(user);
    exists.mockResolvedValue({ _id: "other" });
    const res = mockRes();

    await expect(
      googleAuthController.completeProfile(
        {
          user: { _id: "user-id" },
          body: { username: "ada", postalCode: "10115", city: "Berlin", state: "Berlin" },
        } as unknown as Request,
        res,
      ),
    ).rejects.toMatchObject({ statusCode: 409 });
    expect(resolveGermanAddress).not.toHaveBeenCalled();

    exists.mockResolvedValue(null);
    resolveGermanAddress.mockRejectedValue(Object.assign(new Error("Postal code, city, and state do not match."), { statusCode: 400 }));

    await expect(
      googleAuthController.completeProfile(
        {
          user: { _id: "user-id" },
          body: { username: "ada", postalCode: "10115", city: "Hamburg", state: "Hamburg" },
        } as unknown as Request,
        res,
      ),
    ).rejects.toMatchObject({ statusCode: 400 });
    expect(user.save).not.toHaveBeenCalled();
  });
});

describe("socket eksik profil", () => {
  test("tamamlanmamis profil baglanamaz", async () => {
    const token = jwt.sign(
      { _id: "user-id", username: "", isActive: true, role: "user" },
      process.env.ACCESS_KEY!,
    );
    findById.mockReturnValue({
      select: jest.fn().mockResolvedValue({
        firstName: "Ada",
        lastName: "Lovelace",
        username: undefined,
        location: undefined,
      }),
    });
    const next = jest.fn();

    await socketAuth({ handshake: { auth: { token } }, data: {} } as never, next);

    expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: "Profile is incomplete.", statusCode: 403 }));
  });
});
