"use strict";

import type { Request, Response } from "express";
import CustomError from "../../helpers/customError.js";
import { toAdminEventDTO } from "../../helpers/toEventDTO.js";
import { sendMail } from "../../mail/mail.service.js";
import { eventApprovedTemplate } from "../../mail/templates/eventApproved.template.js";
import { eventCancelledTemplate } from "../../mail/templates/eventCancelled.template.js";
import { eventRejectedTemplate } from "../../mail/templates/eventRejected.template.js";
import Event from "../../models/eventModel.js";
import type { UserDocument } from "../../types/user.types.js";
import type { CancelEventInput, RejectEventInput } from "../../validations/event.schema.js";

const CREATED_BY_POPULATE = { path: 'createdBy', select: 'username email avatarUrl role' };

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

    const createdBy = event.createdBy as unknown as UserDocument;

    try {
      await sendMail({
        to: createdBy.email,
        subject: "Event genehmigt",
        html: eventApprovedTemplate({
          username: createdBy.username,
          eventTitle: event.title,
          eventSlug: event.slug,
        }),
      });
    } catch (error) {
      console.log("Failed to send email.", error);
    }

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

    const createdBy = event.createdBy as unknown as UserDocument;

    try {
      await sendMail({
        to: createdBy.email,
        subject: "Event abgelehnt",
        html: eventRejectedTemplate({
          username: createdBy.username,
          eventTitle: event.title,
          rejectedReason: event.rejectedReason,
        }),
      });
    } catch (error) {
      console.log("Failed to send email.", error);
    }

    res.status(200).send({
      error: false,
      event: toAdminEventDTO(event)
    });

  },

  cancel: async (req: Request<{ id: string }, any, CancelEventInput>, res: Response) => {

    const event = await Event.findById(req.params.id).populate(CREATED_BY_POPULATE);

    if (!event) {
      throw new CustomError('Event not found', 404);
    }

    event.status = 'cancelled';
    event.cancelledReason = req.body.cancelledReason;
    await event.save();

    const createdBy = event.createdBy as unknown as UserDocument;

    try {
      await sendMail({
        to: createdBy.email,
        subject: "Event abgesagt",
        html: eventCancelledTemplate({
          username: createdBy.username,
          eventTitle: event.title,
          cancelledReason: event.cancelledReason,
        }),
      });
    } catch (error) {
      console.log("Failed to send email.", error);
    }

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

