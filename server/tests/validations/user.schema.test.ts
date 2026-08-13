import {
  changePasswordSchema,
  createUserSchema,
  loginSchema,
} from "../../src/validations/user.schema.js";

/**
 * createUserSchema bir string değil, bir OBJEYİ kontrol eder.
 * Bu yüzden her testte username + email + password + location gibi
 * zorunlu alanları birlikte veriyoruz.
 *
 * Kullanım:
 *   const result = createUserSchema.safeParse(data)
 *   result.success === true  → kabul
 *   result.success === false → red
 */

const validUser = {
  username: "duygu",
  firstName: "Duygu",
  lastName: "Cankurt",
  email: "duygu@gmail.com",
  password: "Sifre123!",
  location: {
    state: "Berlin",
    city: "Berlin",
    zipCode: "10115",
  },
};

describe("createUserSchema", () => {
  test("gecerli body kabul edilir", () => {
    const result = createUserSchema.safeParse(validUser);

    expect(result.success).toBe(true);
  });

  test("username 2 karakterden kisaysa reddedilir", () => {
    const result = createUserSchema.safeParse({
      ...validUser,
      username: "d",
    });

    expect(result.success).toBe(false);
  });

  test("username 50 karakterden uzunsa reddedilir", () => {
    const result = createUserSchema.safeParse({
      ...validUser,
      username: "a".repeat(51),
    });

    expect(result.success).toBe(false);
  });

  test("username trim edilir", () => {
    const result = createUserSchema.safeParse({
      ...validUser,
      username: "  duygu  ",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.username).toBe("duygu");
    }
  });

  test("bozuk email reddedilir", () => {
    const result = createUserSchema.safeParse({
      ...validUser,
      email: "dyg.cankurt@",
    });

    expect(result.success).toBe(false);
  });

  test("email kucuk harfe cevrilir", () => {
    const result = createUserSchema.safeParse({
      ...validUser,
      email: "DYG.cankurt@gmail.com",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("dyg.cankurt@gmail.com");
    }
  });

  test("zayif sifre reddedilir", () => {
    const result = createUserSchema.safeParse({
      ...validUser,
      password: "123456",
    });

    expect(result.success).toBe(false);
  });

  test("location.city yoksa reddedilir", () => {
    const result = createUserSchema.safeParse({
      ...validUser,
      location: {},
    });

    expect(result.success).toBe(false);
  });

  // --- firstName / lastName ---

  test("firstName 2 karakterden kisaysa reddedilir", () => {
    const result = createUserSchema.safeParse({
      ...validUser,
      firstName: "D",
    });

    expect(result.success).toBe(false);
  });

  test("lastName 2 karakterden kisaysa reddedilir", () => {
    const result = createUserSchema.safeParse({
      ...validUser,
      lastName: "C",
    });

    expect(result.success).toBe(false);
  });

  test("firstName ve lastName trim edilir", () => {
    const result = createUserSchema.safeParse({
      ...validUser,
      firstName: "  Duygu  ",
      lastName: "  Cankurt  ",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.firstName).toBe("Duygu");
      expect(result.data.lastName).toBe("Cankurt");
    }
  });

  // --- .strict() ---
  // Schema'da tanımlı olmayan ekstra alan gelirse red.

  test("bilinmeyen ekstra alan gelirse reddedilir", () => {
    const result = createUserSchema.safeParse({
      ...validUser,
      role: "admin",
    });

    expect(result.success).toBe(false);
  });

  // --- phone / zipCode ---

  test("gecerli phone kabul edilir", () => {
    const result = createUserSchema.safeParse({
      ...validUser,
      phone: "+4915212345678",
    });

    expect(result.success).toBe(true);
  });

  test("phone null olabilir", () => {
    const result = createUserSchema.safeParse({
      ...validUser,
      phone: null,
    });

    expect(result.success).toBe(true);
  });

  test("gecersiz phone reddedilir", () => {
    const result = createUserSchema.safeParse({
      ...validUser,
      phone: "abc",
    });

    expect(result.success).toBe(false);
  });

  test("gecerli zipCode kabul edilir", () => {
    const result = createUserSchema.safeParse({
      ...validUser,
      location: {
        state: "Berlin",
        city: "Berlin",
        zipCode: "10115",
      },
    });

    expect(result.success).toBe(true);
  });

  test("gecersiz zipCode reddedilir", () => {
    const result = createUserSchema.safeParse({
      ...validUser,
      location: {
        state: "Berlin",
        city: "Berlin",
        zipCode: "101",
      },
    });

    expect(result.success).toBe(false);
  });

  test("location.state yoksa reddedilir", () => {
    const result = createUserSchema.safeParse({
      ...validUser,
      location: {
        city: "Berlin",
        zipCode: "10115",
      },
    });

    expect(result.success).toBe(false);
  });

  test("location.zipCode yoksa reddedilir", () => {
    const result = createUserSchema.safeParse({
      ...validUser,
      location: {
        state: "Berlin",
        city: "Berlin",
      },
    });

    expect(result.success).toBe(false);
  });
});

/**
 * loginSchema sadece 2 alan ister: login + password.
 * Register alanlarını (username, email, firstName, location...) burada test etme.
 */
const validLogin = {
  login: "duygu",
  password: "Sifre123!",
};

describe("loginSchema", () => {
  test("gecerli body kabul edilir", () => {
    const result = loginSchema.safeParse(validLogin);

    expect(result.success).toBe(true);
  });

  test("email ile login kabul edilir", () => {
    const result = loginSchema.safeParse({
      ...validLogin,
      login: "duygu@gmail.com",
    });

    expect(result.success).toBe(true);
  });

  test("login 2 karakterden kisaysa reddedilir", () => {
    const result = loginSchema.safeParse({
      ...validLogin,
      login: "d",
    });

    expect(result.success).toBe(false);
  });

  test("password 2 karakterden kisaysa reddedilir", () => {
    const result = loginSchema.safeParse({
      ...validLogin,
      password: "1",
    });

    expect(result.success).toBe(false);
  });

  test("login trim edilir", () => {
    const result = loginSchema.safeParse({
      ...validLogin,
      login: "  duygu  ",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.login).toBe("duygu");
    }
  });

  test("bilinmeyen ekstra alan gelirse reddedilir", () => {
    const result = loginSchema.safeParse({
      ...validLogin,
      role: "admin",
    });

    expect(result.success).toBe(false);
  });
});

/**
 * changePasswordSchema 3 alan ister:
 * currentPassword + newPassword + confirmPassword
 * newPassword ile confirmPassword aynı olmalı (.refine)
 */
const validChangePassword = {
  currentPassword: "EskiSifre1!",
  newPassword: "YeniSifre1!",
  confirmPassword: "YeniSifre1!",
};

describe("changePasswordSchema", () => {
  test("gecerli body kabul edilir", () => {
    const result = changePasswordSchema.safeParse(validChangePassword);

    expect(result.success).toBe(true);
  });

  test("currentPassword 6 karakterden kisaysa reddedilir", () => {
    const result = changePasswordSchema.safeParse({
      ...validChangePassword,
      currentPassword: "12345",
    });

    expect(result.success).toBe(false);
  });

  test("zayif newPassword reddedilir", () => {
    const result = changePasswordSchema.safeParse({
      ...validChangePassword,
      newPassword: "12345678",
      confirmPassword: "12345678",
    });

    expect(result.success).toBe(false);
  });

  test("newPassword ile confirmPassword uyusmazsa reddedilir", () => {
    const result = changePasswordSchema.safeParse({
      ...validChangePassword,
      confirmPassword: "BaskaSifre1!",
    });

    expect(result.success).toBe(false);
  });

  test("newPassword 8 karakterden kisaysa reddedilir", () => {
    const result = changePasswordSchema.safeParse({
      ...validChangePassword,
      newPassword: "Ab1!",
      confirmPassword: "Ab1!",
    });

    expect(result.success).toBe(false);
  });
});
