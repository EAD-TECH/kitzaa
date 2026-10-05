"use strict";

import type { Request, Response } from "express";
import { aiEventSearchRequestSchema } from "../../validations/ai/ai.validation.js";
import { getAiResponse } from "../../services/ai/ai.service.js";
import { getMissingRequiredField } from "../../helpers/ai/getMissingRequiredField.js";
import {
  deleteConversationState,
  getConversationState,
  saveConversationState,
} from "../../services/ai/conversationState.service.js";
import { randomUUID } from "node:crypto";
import { buildAiEventSearchFilter } from "../../helpers/ai/buildAiEventSearchFilter.js";
import { searchEvents } from "../../services/eventSearchService.js";
import { toEventDTO } from "../../helpers/toEventDTO.js";
import CustomError from "../../helpers/customError.js";

const aiEventSearchController = {
  aiEventSearch: async (req: Request, res: Response) => {
    const parsedData = aiEventSearchRequestSchema.safeParse(req.body);

    if (!parsedData.success) {
      return res.status(400).json({
        message: "Invalid request",
        errors: parsedData.error.flatten(),
      });
    }

    const { message, conversationId: incomingConversationId } = parsedData.data;

    const conversationId = incomingConversationId ?? randomUUID();

    let previousState;
    try {
      previousState = await getConversationState(conversationId);
    } catch (error) {
      console.error("AI conversation state could not be read:", error);
      throw new CustomError("AI search is temporarily unavailable.", 503);
    }

    let aiResponse;
    try {
      aiResponse = await getAiResponse(message, previousState);
    } catch (error) {
      console.error("AI preference extraction failed:", error);
      throw new CustomError("AI search is temporarily unavailable.", 503);
    }

    const missingField = getMissingRequiredField(aiResponse);

    if (missingField) {
      try {
        await saveConversationState(conversationId, aiResponse);
      } catch (error) {
        console.error("AI conversation state could not be saved:", error);
        throw new CustomError("AI search is temporarily unavailable.", 503);
      }

      return res.status(200).json({
        type: "question",
        conversationId,
        missingField,
        filters: aiResponse,
      });
    }

    const eventSearchFilter = buildAiEventSearchFilter(aiResponse);

    const events = await searchEvents(eventSearchFilter);
    const eventDtos = toEventDTO(events).map((event) => ({
      ...event,
      ageRanges: event.ageRanges.length > 0 ? event.ageRanges : ["all-ages"],
    }));

    if (incomingConversationId) {
      try {
        await deleteConversationState(conversationId);
      } catch (error) {
        // Search results are still valid; Redis cleanup must not fail the request.
        console.error("AI conversation state could not be deleted:", error);
      }
    }

    return res.status(200).json({
      type: "ready",
      conversationId,
      filters: aiResponse,
      events: eventDtos,
    });
  },
};

export default aiEventSearchController;
