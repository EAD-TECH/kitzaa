import { generateText, Output } from "ai";
import { google } from "@ai-sdk/google";
import { berlinNow } from "../../helpers/ai/berlinTime.js";
import { aiEventSearchOutputSchema } from "../../validations/ai/ai-event-search-output.validation.js";
import type { AiEventSearchOutput } from "../../validations/ai/ai-event-search-output.validation.js";

const AI_MODEL = "gemini-3.5-flash-lite";
const AI_GENERATION_ATTEMPTS = 2;
const AI_TIMEOUT_MS = 20_000;

const instructions = `
You extract event search preferences from German, English, or Turkish text.
Return only values supported by the output schema.

Rules:
- Preserve a value from the previous state unless the new message clearly changes it.
- Never invent a preference that is absent from both the previous state and new message.
- Use null for unknown values and "any" only when the user explicitly says they have no preference.
- childAges is an array containing every child age the user mentions.
- If no child age is known, childAges must be null.
- cities is an array containing every city the user mentions.
- If no city is known, cities must be null.
- If the user explicitly has no city preference, use ["any"].
- "today", "tomorrow", "weekend", and "this month" map to datePreference and require specificDate null.
- "bu ay", "diesen Monat", and "this month" map to datePreference "thisMonth".
- A named calendar day maps to datePreference "specific" and specificDate in YYYY-MM-DD.
- Use the current year when the user does not give a year.
- A request for a particular but unspecified day maps to "specific" with specificDate null.
- "free", "kostenlos", or "ücretsiz" means maxPrice 0.
- Do not infer environment, timePreference, or maxPrice from unrelated wording.
`;

const buildPrompt = (
  message: string,
  previousState: AiEventSearchOutput | null,
) => `
Previous validated state:
${JSON.stringify(previousState)}

New user message:
${message}

Current date in Europe/Berlin: ${berlinNow().format("YYYY-MM-DD")}
`;

const generateAiResponse = async (
  message: string,
  previousState: AiEventSearchOutput | null,
) => {
  const { output } = await generateText({
    model: google(AI_MODEL),
    system: instructions,
    prompt: buildPrompt(message, previousState),
    temperature: 0,
    maxOutputTokens: 500,
    maxRetries: 0,
    timeout: AI_TIMEOUT_MS,
    output: Output.object({
      schema: aiEventSearchOutputSchema,
    }),
  });

  return output;
};

export const getAiResponse = async (
  message: string,
  previousState: AiEventSearchOutput | null,
) => {
  let lastError: unknown;

  for (let attempt = 0; attempt < AI_GENERATION_ATTEMPTS; attempt += 1) {
    try {
      return await generateAiResponse(message, previousState);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError ?? new Error("AI response generation failed");
};
