import { buildAiEventSearchFilter } from "../../src/helpers/ai/buildAiEventSearchFilter.js";
import type { AiEventSearchOutput } from "../../src/validations/ai/ai-event-search-output.validation.js";

const createFilters = (
  overrides: Partial<AiEventSearchOutput> = {},
): AiEventSearchOutput => ({
  childAges: [5],
  datePreference: "any",
  specificDate: null,
  environment: null,
  timePreference: null,
  cities: ["Pforzheim"],
  maxPrice: null,
  ...overrides,
});

describe("buildAiEventSearchFilter", () => {
  test("tek çocuk için uygun yaş aralığını ve all-ages etkinlikleri bulur", () => {
    const query = buildAiEventSearchFilter(createFilters());

    expect(query.ageRange).toEqual({
      $in: ["all-ages", "4-6", null],
    });
  });

  test("birden fazla çocuk için ortak yaş aralıklarını kullanır", () => {
    const query = buildAiEventSearchFilter(
      createFilters({ childAges: [5, 8] }),
    );

    expect(query.ageRange).toEqual({
      $in: ["all-ages", null],
    });
  });

  test("yaş aralığı belirtilmemiş legacy etkinlikleri dışlamaz", () => {
    const query = buildAiEventSearchFilter(createFilters());

    expect(query.ageRange).toEqual(
      expect.objectContaining({
        $in: expect.arrayContaining([null]),
      }),
    );
  });

  test("fiyat belirtilmediğinde ücretsiz ve ücretli etkinlikleri kısıtlamaz", () => {
    const query = buildAiEventSearchFilter(createFilters());

    expect(query).not.toHaveProperty("isFree");
    expect(query).not.toHaveProperty("$or");
  });

  test("sıfır bütçede yalnızca ücretsiz etkinlikleri arar", () => {
    const query = buildAiEventSearchFilter(
      createFilters({ maxPrice: 0 }),
    );

    expect(query.isFree).toBe(true);
  });

  test("pozitif bütçede ücretsiz ve fiyat sınırına uyan etkinlikleri arar", () => {
    const query = buildAiEventSearchFilter(
      createFilters({ maxPrice: 15 }),
    );

    expect(query.$or).toEqual([
      { isFree: true },
      {
        isFree: false,
        "price.amount": { $lte: 15 },
      },
    ]);
  });

  test("şehir değerindeki regex karakterlerini literal kabul eder", () => {
    const query = buildAiEventSearchFilter(
      createFilters({ cities: ["Berlin (Mitte)"] }),
    );
    const cityFilter = query["location.city"] as { $in: RegExp[] };

    expect(cityFilter.$in[0]?.test("Berlin (Mitte)")).toBe(true);
    expect(cityFilter.$in[0]?.test("Berlin Mitte")).toBe(false);
  });

  test("tarih tercihi yokken geçmiş etkinlikleri dışarıda bırakır", () => {
    const before = new Date();
    const query = buildAiEventSearchFilter(createFilters());
    const dateFilter = query["schedule.startDate"] as { $gte: Date };

    expect(dateFilter.$gte).toBeInstanceOf(Date);
    expect(dateFilter.$gte.getTime()).toBeLessThanOrEqual(before.getTime());
  });
});
