import type { Request, Response } from "express";
import { hashToken } from "../../src/helpers/generateSecureToken.js";

const findOne = jest.fn();

jest.mock("../../src/models/userModel.js", () => ({
  __esModule: true,
  default: {
    findOne: (...args: unknown[]) => findOne(...args),
  },
}));

jest.mock("../../src/mail/mail.service.js", () => ({
  sendMail: jest.fn(),
}));

import authController from "../../src/controllers/auth/authController.js";
import { sendMail } from "../../src/mail/mail.service.js";

const GENERIC_RESET = {
  error: "false",
  message:
    "Falls die E-Mail-Adresse existiert, wurde ein Link zum Zurücksetzen des Passworts gesendet.",
};

const INVALID_LOGIN = {
  message: "Wrong email/username or password",
  statusCode: 401,
};

function queryOf<T>(value: T) {
  const query = Promise.resolve(value) as Promise<T> & { select: jest.Mock };
  query.select = jest.fn().mockResolvedValue(value);
  return query;
}

function mockRes() {
  const res = {
    status: jest.fn(),
    json: jest.fn(),
    send: jest.fn(),
    cookie: jest.fn(),
    clearCookie: jest.fn(),
  };
  res.status.mockReturnValue(res);
  res.json.mockReturnValue(res);
  res.send.mockReturnValue(res);
  return res as unknown as Response & typeof res;
}

function passwordUser(overrides: Record<string, unknown> = {}) {
  return {
    _id: "user-id",
    username: "ada",
    firstName: "Ada",
    lastName: "Lovelace",
    email: "ada@gmail.com",
    password: "stored-hash",
    googleSub: undefined,
    authProviders: ["password"],
    refreshToken: "old-refresh",
    passwordResetToken: null as string | null,
    passwordResetExp: null as Date | null,
    isActive: true,
    role: "user",
    language: "de",
    institutionId: null,
    phone: null,
    avatarUrl: null,
    isEmailVerified: true,
    location: {
      state: "Berlin",
      city: "Berlin",
      zipCode: "10115",
      country: "DE",
    },
    savedEvents: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    save: jest.fn().mockResolvedValue(undefined),
    matchPassword: jest.fn().mockResolvedValue(true),
    ...overrides,
  };
}

describe("login sifresiz hesap", () => {
  beforeAll(() => {
    process.env.ACCESS_KEY = "test-access-key";
    process.env.REFRESH_KEY = "test-refresh-key";
    process.env.NODE_ENV = "test";
  });

  beforeEach(() => {
    findOne.mockReset();
  });

  test("olmayan hesap ile sifresiz hesap ayni 401 mesajini verir", async () => {
    const res = mockRes();
    findOne.mockReturnValue(queryOf(null));

    await expect(
      authController.login(
        { body: { login: "missing@gmail.com", password: "Sifre123!" } } as Request,
        res,
      ),
    ).rejects.toMatchObject(INVALID_LOGIN);

    const googleOnly = passwordUser({ password: undefined, authProviders: ["google"] });
    findOne.mockReturnValue(queryOf(googleOnly));

    await expect(
      authController.login(
        { body: { login: "ada@gmail.com", password: "Sifre123!" } } as Request,
        res,
      ),
    ).rejects.toMatchObject(INVALID_LOGIN);

    expect(googleOnly.matchPassword).not.toHaveBeenCalled();
    expect(googleOnly.save).not.toHaveBeenCalled();
  });

  test("sifreli hesapta yanlis sifre eski 404 mesajinda kalir", async () => {
    const user = passwordUser();
    user.matchPassword.mockResolvedValue(false);
    findOne.mockReturnValue(queryOf(user));
    const res = mockRes();

    await expect(
      authController.login(
        { body: { login: "ada", password: "Yanlis1!" } } as Request,
        res,
      ),
    ).rejects.toMatchObject({
      message: "Invalid email or password.",
      statusCode: 404,
    });
  });

  test("sifreli hesap giris yapabilir", async () => {
    const user = passwordUser();
    findOne.mockReturnValue(queryOf(user));
    const res = mockRes();

    await authController.login(
      { body: { login: "ada", password: "Sifre123!" } } as Request,
      res,
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(user.save).toHaveBeenCalled();
    expect(res.cookie).toHaveBeenCalled();
  });
});

describe("forgotPassword ve resetPassword", () => {
  const sendMailMock = sendMail as jest.MockedFunction<typeof sendMail>;

  beforeAll(() => {
    process.env.CLIENT_URL = "http://localhost:3000";
  });

  beforeEach(() => {
    findOne.mockReset();
    sendMailMock.mockReset();
    sendMailMock.mockResolvedValue(undefined);
  });

  test("olmayan e-posta da kayitli e-posta da ayni genel yaniti alir", async () => {
    const res = mockRes();
    findOne.mockReturnValueOnce(queryOf(null));

    await authController.forgotPassword(
      { body: { email: "missing@gmail.com" } } as Request,
      res,
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(GENERIC_RESET);
    expect(sendMailMock).not.toHaveBeenCalled();

    const googleOnly = passwordUser({
      username: undefined,
      password: undefined,
      googleSub: "google-sub-1",
      authProviders: ["google"],
    });
    findOne.mockReturnValueOnce(queryOf(googleOnly));

    await authController.forgotPassword(
      { body: { email: "ada@gmail.com" } } as Request,
      res,
    );

    expect(res.json).toHaveBeenLastCalledWith(GENERIC_RESET);
    expect(googleOnly.passwordResetToken).toEqual(expect.any(String));
    expect(googleOnly.googleSub).toBe("google-sub-1");
    expect(googleOnly.password).toBeUndefined();
    expect(sendMailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "ada@gmail.com",
        html: expect.stringContaining("Ada"),
      }),
    );
  });

  test("suresi gecmis veya kullanilmis token 400 verir ve sifreyi yazmaz", async () => {
    findOne.mockReturnValue(queryOf(null));
    const res = mockRes();

    await expect(
      authController.resetPassword(
        { params: { token: "raw-token" }, body: { newPassword: "YeniSifre1!" } } as Request,
        res,
      ),
    ).rejects.toMatchObject({
      message: "Der Link ist ungültig oder abgelaufen.",
      statusCode: 400,
    });

    expect(findOne).toHaveBeenCalledWith({
      passwordResetToken: hashToken("raw-token"),
      passwordResetExp: { $gt: expect.any(Date) },
    });
    expect(res.clearCookie).not.toHaveBeenCalled();
  });

  test("gecerli token sifreyi yazar, tokeni ve refresh oturumunu dusurur, googleSub'u birakir", async () => {
    const user = passwordUser({
      password: undefined,
      googleSub: "google-sub-1",
      authProviders: ["google"],
      refreshToken: "old-refresh",
    });
    findOne.mockReturnValue(queryOf(user));
    const res = mockRes();

    await authController.resetPassword(
      {
        params: { token: "raw-token" },
        body: { newPassword: "YeniSifre1!", confirmPassword: "YeniSifre1!" },
      } as Request,
      res,
    );

    expect(user.password).toBe("YeniSifre1!");
    expect(user.googleSub).toBe("google-sub-1");
    expect(user.authProviders).toEqual(["google", "password"]);
    expect(user.passwordResetToken).toBeNull();
    expect(user.passwordResetExp).toBeNull();
    expect(user.refreshToken).toBeNull();
    expect(user.save).toHaveBeenCalledTimes(1);
    expect(res.clearCookie).toHaveBeenCalledWith(
      "refreshToken",
      expect.objectContaining({ httpOnly: true, path: "/" }),
    );
    expect(res.status).toHaveBeenCalledWith(200);

    findOne.mockReturnValue(queryOf(null));
    await expect(
      authController.resetPassword(
        { params: { token: "raw-token" }, body: { newPassword: "YeniSifre1!" } } as Request,
        res,
      ),
    ).rejects.toMatchObject({ statusCode: 400 });
  });
});
