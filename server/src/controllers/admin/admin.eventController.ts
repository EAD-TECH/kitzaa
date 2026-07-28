"use strict";

import type { Request, Response } from "express";
import CustomError from "../../helpers/customError.js";
import { toAdminEventDTO } from "../../helpers/toEventDTO.js";
import Event from "../../models/eventModel.js";
import type { RejectEventInput } from "../../validations/event.schema.js";

const CREATED_BY_POPULATE = { path: 'createdBy', select: 'username avatarUrl role' };

const adminEventController = {

  list: async (req: Request, res: Response) => {

    const result = await res.getModelList(Event, {}, [
      { path: 'categoryId', select: 'name slug icon' },
      CREATED_BY_POPULATE,
    ]);

    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(Event),
      events: toAdminEventDTO(result)
    });

  },

  read: async (req: Request<{ id: string }>, res: Response) => {

    const result = await Event.findById(req.params.id).populate(CREATED_BY_POPULATE);

    if (!result) {
      throw new CustomError('Event not found', 404);
    }

    res.status(200).send({
      error: false,
      event: toAdminEventDTO(result)
    });

  },

  approve: async (req: Request<{ id: string }>, res: Response) => {

    const event = await Event.findById(req.params.id).populate(CREATED_BY_POPULATE)

    if (!event) {
      throw new CustomError('Event not found', 404);
    }

    event.status = 'approved'
    await event.save()

    res.status(200).send({
      error: false,
      event: toAdminEventDTO(event)
    });

  },

  reject: async (req: Request<{ id: string }, any, RejectEventInput>, res: Response) => {

    const event = await Event.findById(req.params.id).populate(CREATED_BY_POPULATE);

    if (!event) {
      throw new CustomError('Event not found', 404);
    }

    event.status = 'rejected';
    event.rejectedReason = req.body.rejectedReason;
    await event.save();

    res.status(200).send({
      error: false,
      event: toAdminEventDTO(event)
    });

  },

  cancel: async (req: Request<{ id: string }>, res: Response) => {

    const event = await Event.findById(req.params.id).populate(CREATED_BY_POPULATE);

    if (!event) {
      throw new CustomError('Event not found', 404);
    }

    event.status = 'cancelled';
    await event.save();

    res.status(200).send({
      error: false,
      event: toAdminEventDTO(event)
    });

  },

  deletee: async (req: Request<{ id: string }>, res: Response) => {

    const result = await Event.findByIdAndDelete(req.params.id);

    if (!result) {
      throw new CustomError('Event not found or already deleted.', 404);
    }

    res.sendStatus(204);

  }

};

export default adminEventController;

