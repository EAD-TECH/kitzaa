import bcrypt from "bcrypt";
import { mongoose } from "../../src/configs/dbConnection.js";
import {
  applyPasswordReset,
  hashPasswordIfNeeded,
  syncAuthProvidersForNewUser,
} from "../../src/helpers/authCredentials.js";
import User from "../../src/models/userModel.js";

const localFields = {
  username: "ada",
  firstName: "Ada",
  lastName: "Lovelace",
  email: "ada@gmail.com",
  password: "Sifre123!",
  location: {
    state: "Berlin",
    city: "Berlin",
    zipCode: "10115",
    country: "DE",
  },
};

describe("User kimlik alanlari", () => {
  test("mevcut sifre hesabi username, sifre ve konum olmadan dogrulanamaz", async () => {
    const user = new User({
      firstName: "Ada",
      lastName: "Lovelace",
      email: "ada@gmail.com",
    });

    await expect(user.validate()).rejects.toBeInstanceOf(
      mongoose.Error.ValidationError,
    );
  });

  test("eski sifre hesabi authProviders alani olmadan da gecerlidir", async () => {
    const user = new User(localFields);

    await expect(user.validate()).resolves.toBeUndefined();
    expect(user.googleSub).toBeUndefined();
    expect(user.authProviders).toBeUndefined();
  });

  test("kayitli sifre hesabi sonraki kayitta sifre secilmeden dogrulanir", async () => {
    const user = new User(localFields);
    await user.validate();

    user.isNew = false;
    user.password = undefined;
    user.unmarkModified("password");

    await expect(user.validate()).resolves.toBeUndefined();
  });

  test("google hesabi sifre, kullanici adi ve konum olmadan durabilir", async () => {
    const user = new User({
      firstName: "Ada",
      lastName: "Lovelace",
      email: "ada@gmail.com",
      googleSub: "google-sub-1",
      authProviders: ["google"],
    });

    await expect(user.validate()).resolves.toBeUndefined();
    await expect(user.matchPassword("Sifre123!")).resolves.toBe(false);
  });

  test("googleSub benzersiz ve sparse, username sparse unique", () => {
    const googleSub = User.schema.path("googleSub");
    const username = User.schema.path("username");

    expect(googleSub.options.unique).toBe(true);
    expect(googleSub.options.sparse).toBe(true);
    expect(username.options.unique).toBe(true);
    expect(username.options.sparse).toBe(true);
  });
});

describe("sifre hash", () => {
  test("bos veya tanımsız sifre hash'lenmez", async () => {
    await expect(hashPasswordIfNeeded(undefined, true)).resolves.toBeUndefined();
    await expect(hashPasswordIfNeeded("", true)).resolves.toBeUndefined();
  });

  test("degismemis sifre oldugu gibi kalir", async () => {
    await expect(hashPasswordIfNeeded("Sifre123!", false)).resolves.toBe(
      "Sifre123!",
    );
  });

  test("gercek sifre bcrypt ile hash'lenir", async () => {
    const hashed = await hashPasswordIfNeeded("Sifre123!", true);

    expect(hashed).toEqual(expect.any(String));
    expect(hashed).not.toBe("Sifre123!");
    await expect(bcrypt.compare("Sifre123!", hashed!)).resolves.toBe(true);
  });

  test("yeni sifre hesabina password saglayicisi yazilir, eski hesaba yazilmaz", () => {
    const created = {
      isNew: true,
      password: "Sifre123!",
      authProviders: undefined,
    };
    syncAuthProvidersForNewUser(created);
    expect(created.authProviders).toEqual(["password"]);

    const existing = {
      isNew: false,
      password: "Sifre123!",
      authProviders: undefined,
    };
    syncAuthProvidersForNewUser(existing);
    expect(existing.authProviders).toBeUndefined();
  });
});

describe("applyPasswordReset", () => {
  test("sifreli hesapta token tek kullanimlik olur ve oturum dusurulur", () => {
    const user = {
      password: "old-hash",
      passwordResetToken: "hashed-token",
      passwordResetExp: new Date(Date.now() + 60_000),
      refreshToken: "refresh-session",
      authProviders: ["password" as const],
      googleSub: undefined,
    };

    applyPasswordReset(user, "YeniSifre1!");

    expect(user.password).toBe("YeniSifre1!");
    expect(user.passwordResetToken).toBeNull();
    expect(user.passwordResetExp).toBeNull();
    expect(user.refreshToken).toBeNull();
    expect(user.googleSub).toBeUndefined();
    expect(user.authProviders).toEqual(["password"]);
  });

  test("google hesabina sifre eklenirken googleSub kalir ve iki yontem acilir", () => {
    const user = {
      password: undefined,
      passwordResetToken: "hashed-token",
      passwordResetExp: new Date(Date.now() + 60_000),
      refreshToken: "refresh-session",
      googleSub: "google-sub-1",
      authProviders: ["google" as const],
    };

    applyPasswordReset(user, "YeniSifre1!");

    expect(user.password).toBe("YeniSifre1!");
    expect(user.googleSub).toBe("google-sub-1");
    expect(user.authProviders).toEqual(["google", "password"]);
    expect(user.passwordResetToken).toBeNull();
    expect(user.refreshToken).toBeNull();
  });
});
