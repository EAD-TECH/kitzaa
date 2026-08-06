import { slugify, generateUniqueSlug } from "../../src/helpers/slugify.js";

describe("slugify", () => {
  test("basit metni küçük harfe çevirip tireyle birleştirir", () => {
    expect(slugify("Kinder Fest")).toBe("kinder-fest");
  });

  test("baştaki ve sondaki boşlukları temizler", () => {
    expect(slugify("  Hallo Welt  ")).toBe("hallo-welt");
  });

  test("özel karakterleri kaldırır", () => {
    expect(slugify("Hallo!!! Welt???")).toBe("hallo-welt");
  });

  test("birden fazla boşluğu tek tire yapar", () => {
    expect(slugify("Hallo    Welt")).toBe("hallo-welt");
  });

  test("almanca karakterleri dönüştürür", () => {
    expect(slugify("Käse Öl Über")).toBe("kase-ol-uber");
  });

  test("ß harfini ss yapar", () => {
    expect(slugify("Straße")).toBe("strasse");
  });
});

describe("generateUniqueSlug", () => {
  test("slug bossa oldugu gibi doner", async () => {
    const checkExists = async () => false;
    await expect(generateUniqueSlug("Kinder Fest", checkExists)).resolves.toBe(
      "kinder-fest"
    );
  });

  test("slug doluysa -2 ekler", async () => {
    const checkExists = async (slug: string) => slug === "kinder-fest";
    await expect(generateUniqueSlug("Kinder Fest", checkExists)).resolves.toBe(
      "kinder-fest-2"
    );
  });
});
