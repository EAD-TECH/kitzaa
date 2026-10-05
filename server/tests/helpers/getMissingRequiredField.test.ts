import { getMissingRequiredField } from "../../src/helpers/ai/getMissingRequiredField.js";
import type { AiEventSearchOutput } from "../../src/validations/ai/ai-event-search-output.validation.js";

const completeFilters: AiEventSearchOutput = {
  childAges: [5],
  datePreference: "specific",
  specificDate: "2026-10-31",
  environment: null,
  timePreference: null,
  cities: ["Pforzheim"],
  maxPrice: null,
};

describe("getMissingRequiredField", () => {
  test("çocuk yaşı bilinmiyorsa childAges döndürür", () => {
    expect(
      getMissingRequiredField({ ...completeFilters, childAges: null }),
    ).toBe("childAges");
  });

  test("tarih tercihi bilinmiyorsa datePreference döndürür", () => {
    expect(
      getMissingRequiredField({ ...completeFilters, datePreference: null }),
    ).toBe("datePreference");
  });

  test("belirli gün seçilip tarih bilinmiyorsa specificDate döndürür", () => {
    expect(
      getMissingRequiredField({ ...completeFilters, specificDate: null }),
    ).toBe("specificDate");
  });

  test("şehir bilinmiyorsa cities döndürür", () => {
    expect(
      getMissingRequiredField({ ...completeFilters, cities: [] }),
    ).toBe("cities");
  });

  test("zorunlu alanlar tamamsa null döndürür", () => {
    expect(getMissingRequiredField(completeFilters)).toBeNull();
  });
});
