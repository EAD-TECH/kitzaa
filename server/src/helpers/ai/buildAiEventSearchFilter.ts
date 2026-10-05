import type { AgeRange } from "../../types/event.types.js";
import type { AiEventSearchOutput } from "../../validations/ai/ai-event-search-output.validation.js";
import { berlinDate, berlinNow } from "./berlinTime.js";

const mapChildAgeToAgeRanges = (age: number): AgeRange[] => {
  const ranges: AgeRange[] = ["all-ages"];

  if (age >= 0 && age <= 3) {
    ranges.push("0-3");
  }

  if (age >= 4 && age <= 6) {
    ranges.push("4-6");
  }

  if (age >= 7 && age <= 10) {
    ranges.push("7-10");
  }

  if (age >= 10 && age <= 14) {
    ranges.push("10-14");
  }

  return ranges;
};

const mapChildAgesToCommonAgeRanges = (ages: number[]): AgeRange[] => {
  const [firstAge, ...remainingAges] = [...new Set(ages)];

  if (firstAge === undefined) {
    return [];
  }

  const commonRanges = new Set(mapChildAgeToAgeRanges(firstAge));

  for (const age of remainingAges) {
    const rangesForAge = new Set(mapChildAgeToAgeRanges(age));

    for (const range of commonRanges) {
      if (!rangesForAge.has(range)) {
        commonRanges.delete(range);
      }
    }
  }

  return [...commonRanges];
};

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const cityMatchers = (cities: string[]) => {
  const uniqueCities = new Set(
    cities
      .map((city) => city.trim())
      .filter((city) => city.length > 0 && city.toLowerCase() !== "any"),
  );

  return [...uniqueCities].map((city) => new RegExp(`^${escapeRegex(city)}$`, "i"));
};

const dateRangeForSpecificDate = (specificDate: string) => {
  const day = berlinDate(specificDate);

  return {
    $gte: day.startOf("day").toDate(),
    $lte: day.endOf("day").toDate(),
  };
};

const dateRangeForPreference = (
  preference: Exclude<NonNullable<AiEventSearchOutput["datePreference"]>, "specific" | "any">,
) => {
  // burada today / tomorrow / weekend dönüşümü

  if (preference === "today") {
    const startOfToday = berlinNow().startOf("day").toDate();
    const endOfToday = berlinNow().endOf("day").toDate();

    // console.log("startOfToday:", startOfToday);
    // console.log("endOfToday:", endOfToday);
    return {
      $gte: startOfToday,
      $lte: endOfToday,
    };
  }

  if (preference === "tomorrow") {
    const tomorrow = berlinNow().add(1, "day");

    const startOfTomorrow = tomorrow.startOf("day").toDate();
    const endOfTomorrow = tomorrow.endOf("day").toDate();

    // console.log("startOfTomorrow:", startOfTomorrow);
    // console.log("endOfTomorrow:", endOfTomorrow);
    return {
      $gte: startOfTomorrow,
      $lte: endOfTomorrow,
    };
  }

  if (preference === "weekend") {
    const today = berlinNow();
    const dayOfWeek = today.day();

    if (dayOfWeek === 0) {
      return {
        $gte: today.startOf("day").toDate(),
        $lte: today.endOf("day").toDate(),
      };
    }

    const daysUntilSaturday = (6 - dayOfWeek + 7) % 7;
    const saturday = today.add(daysUntilSaturday, "day");
    const sunday = saturday.add(1, "day");

    return {
      $gte: saturday.startOf("day").toDate(),
      $lte: sunday.endOf("day").toDate(),
    };
  }

  if (preference === "thisMonth") {
    const now = berlinNow();

    return {
      $gte: now.startOf("day").toDate(),
      $lte: now.endOf("month").toDate(),
    };
  }
};

const timeRangeForPreference = (
  preference: NonNullable<AiEventSearchOutput["timePreference"]>,
) => {
  if (preference === "morning") {
    return {
      $gte: "05:00",
      $lt: "12:00",
    };
  }

  if (preference === "afternoon") {
    return {
      $gte: "12:00",
      $lt: "17:00",
    };
  }

  if (preference === "evening") {
    return {
      $gte: "17:00",
      $lte: "23:59",
    };
  }

  return null;
};

export const buildAiEventSearchFilter = (filters: AiEventSearchOutput): Record<string, unknown> => {
  const query: Record<string, unknown> = {
    status: "approved",
    "schedule.startDate": {
      $gte: berlinNow().startOf("day").toDate(),
    },
  };

  if (filters.childAges !== null) {
    query.ageRange = {
      // Legacy events may not have an ageRange. Treat unspecified age as all-ages
      // until those records are normalized.
      $in: [...mapChildAgesToCommonAgeRanges(filters.childAges), null],
    };
  }

  if (filters.cities) {
    const matchers = cityMatchers(filters.cities);

    if (matchers.length > 0) {
      query["location.city"] = { $in: matchers };
    }
  }

  if (
    filters.environment === "indoor" ||
    filters.environment === "outdoor" ||
    filters.environment === "online"
  ) {
    query.locationType = filters.environment;
  }

  if (filters.datePreference === "specific" && filters.specificDate) {
    query["schedule.startDate"] = dateRangeForSpecificDate(filters.specificDate);
  }

  if (
    filters.datePreference === "today" ||
    filters.datePreference === "tomorrow" ||
    filters.datePreference === "weekend" ||
    filters.datePreference === "thisMonth"
  ) {
    query["schedule.startDate"] = dateRangeForPreference(filters.datePreference);
  }

  if (filters.timePreference && filters.timePreference !== "any") {
    query["schedule.startTime"] = timeRangeForPreference(filters.timePreference);
  }

  if (filters.maxPrice === 0) {
    query.isFree = true;
  } else if (filters.maxPrice !== null) {
    query.$or = [
      { isFree: true },
      {
        isFree: false,
        "price.amount": { $lte: filters.maxPrice },
      },
    ];
  }

  return query;
};
