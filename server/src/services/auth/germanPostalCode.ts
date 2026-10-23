import CustomError from "../../helpers/customError.js";

type PostalPlace = {
  "place name"?: string;
  state?: string;
};

type PostalResponse = {
  places?: PostalPlace[];
};

export function normalizePlace(value: string): string {
  return value.trim().toLocaleLowerCase("de-DE").replace(/\s+/g, " ");
}

export function matchingPlace(
  input: { city: string; state: string },
  places: PostalPlace[],
): { city: string; state: string } | null {
  const city = normalizePlace(input.city);
  const state = normalizePlace(input.state);

  const match = places.find((place) => {
    const placeName = place["place name"];
    return (
      typeof placeName === "string" &&
      typeof place.state === "string" &&
      normalizePlace(placeName) === city &&
      normalizePlace(place.state) === state
    );
  });

  if (!match?.["place name"] || !match.state) return null;
  return { city: match["place name"].trim(), state: match.state.trim() };
}

export async function resolveGermanAddress(
  input: { postalCode: string; city: string; state: string },
  fetchImpl: typeof fetch = fetch,
): Promise<{ zipCode: string; city: string; state: string }> {
  let response: Response;

  try {
    response = await fetchImpl(`https://api.zippopotam.us/de/${input.postalCode}`, {
      signal: AbortSignal.timeout(5_000),
    });
  } catch {
    throw new CustomError("Postal code lookup is unavailable.", 503);
  }

  if (!response.ok) {
    throw new CustomError("Postal code, city, and state do not match.", 400);
  }

  const body = (await response.json()) as PostalResponse;
  const place = matchingPlace(input, body.places ?? []);

  if (!place) {
    throw new CustomError("Postal code, city, and state do not match.", 400);
  }

  return { zipCode: input.postalCode, city: place.city, state: place.state };
}
