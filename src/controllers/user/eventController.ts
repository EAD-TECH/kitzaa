"use strict";

import type { Request, Response } from "express";
import CustomError from "../../helpers/customError.js";
import { toEventDTO } from "../../helpers/toEventDTO.js";
import Event from "../../models/eventModel.js";
import type { EventDocument } from "../../types/event.types.js";
import type { CreateEventInput, UpdateEventInput } from "../../validations/event.schema.js";

const eventController = {

  list: async (req: Request, res: Response) => {
    const customFilter = { status: 'approved' };

    const result = await res.getModelList(Event, customFilter, [
      { path: 'categoryId', select: 'name slug icon' },
      { path: 'createdBy', select: 'username avatarUrl' },
    ]);

    console.log('result', result)

    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(Event, customFilter),
      events: toEventDTO(result)
    });
  },



  read: async (req: Request<{ slug: string }>, res: Response) => {

    const result = await Event.findOneAndUpdate(
      { slug: req.params.slug, status: 'approved' },
      { $inc: { viewCount: 1 } },
      { new: true }
    ).populate([
      { path: 'categoryId', select: 'name slug icon' },
      { path: 'createdBy', select: 'username avatarUrl' },
    ]);

    if (!result) {
      throw new CustomError('Event not found', 404);
    }

    res.status(200).send({
      error: false,
      event: toEventDTO(result)
    });
  },



  create: async (req: Request<{}, any, CreateEventInput>, res: Response) => {

    const validatedData = req.body;

    if (!validatedData.isFree && req.user.role === 'user') {
      throw new CustomError('You must be an organizer to create paid events.', 403);
    }

    const newEvent = await Event.create({
      ...validatedData,
      createdBy: req.user._id,
    });

    res.status(201).send({
      error: false,
      event: toEventDTO(newEvent)
    });
  },




  update: async (req: Request<{ id: string }, any, UpdateEventInput>, res: Response) => {

    // isOwnerOrAdmin middleware'i sahiplik/admin kontrolunu yapip event'i req.resource'a koyuyor.
    const event = req.resource as EventDocument;

    Object.assign(event, req.body);
    await event.save();

    res.status(200).send({
      error: false,
      event: toEventDTO(event)
    });
  },




  deletee: async (req: Request<{ id: string }>, res: Response) => {
    // isOwnerOrAdmin middleware'i sahiplik/admin kontrolunu yapip event'i req.resource'a koyuyor.
    const event = req.resource as EventDocument;

    await event.deleteOne();

    res.sendStatus(204);
  },




  join: async (req: Request<{ id: string }>, res: Response) => {
    
    const event = await Event.findById(req.params.id);

    if (!event) {
      throw new CustomError('Event not found', 404);
    }

    if (event.status !== 'approved') {
      throw new CustomError('You can only join approved events.', 400);
    }

    const alreadyJoined = event.participants?.some(p => p.userId.equals(req.user._id));

    if (alreadyJoined) {
      throw new CustomError('You have already joined this event.', 409);
    }

    if (event.capacity.current >= event.capacity.max) {
      throw new CustomError('This event is full.', 409);
    }

    const updatedEvent = await Event.findOneAndUpdate(
      {
        _id: event._id,
        status: 'approved',
        'participants.userId': { $ne: req.user._id },
        $expr: { $lt: ['$capacity.current', '$capacity.max'] }
      },
      {
        $push: { participants: { userId: req.user._id, status: 'confirmed', joinedAt: new Date() } },
        $inc: { 'capacity.current': 1 }
      },
      { new: true }
    );

    if (!updatedEvent) {
      throw new CustomError('This event is full or you have already joined.', 409);
    }

    res.status(200).send({
      error: false,
      event: toEventDTO(updatedEvent)
    });
  },




  leave: async (req: Request<{ id: string }>, res: Response) => {

    const event = await Event.findById(req.params.id);

    if (!event) {
      throw new CustomError('Event not found', 404);
    }

    const alreadyJoined = event.participants?.some(p => p.userId.equals(req.user._id));

    if (!alreadyJoined) {
      throw new CustomError('You have not joined this event.', 400);
    }

    const updatedEvent = await Event.findOneAndUpdate(
      {
        _id: event._id,
        'participants.userId': req.user._id
      },
      {
        $pull: { participants: { userId: req.user._id } },
        $inc: { 'capacity.current': -1 }
      },
      { new: true }
    );

    if (!updatedEvent) {
      throw new CustomError('You have not joined this event.', 400);
    }

    res.status(200).send({
      error: false,
      event: toEventDTO(updatedEvent)
    });
  },




  toggleLike: async (req: Request<{ id: string }>, res: Response) => {

    const eventId = req.params.id;
    const userId = req.user._id;

    const event = await Event.findById(req.params.id);

    if (!event) {
      throw new CustomError('Event not found', 404);
    }

    const alreadyLiked = event.likes?.some((id) => id.equals(userId)) ?? false;

    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      alreadyLiked
        ? { $pull: { likes: userId } }
        : { $addToSet: { likes: userId } },
      { new: true }
    );

    res.status(200).json({
      error: false,
      liked: !alreadyLiked,
      event: toEventDTO(updatedEvent),
    });

  },




  participants: async (req: Request<{ id: string }>, res: Response) => {
    // isOwnerOrAdmin middleware'i sahiplik/admin kontrolunu yapip event'i req.resource'a koyuyor.
    const event = await (req.resource as EventDocument).populate('participants.userId', 'username avatarUrl');

    res.status(200).send({
      error: false,
      participants: event.participants ?? []
    });
  },




  myEvents: async (req: Request, res: Response) => {

    const customFilter = { createdBy: req.user._id };

    const result = await res.getModelList(Event, customFilter);

    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(Event, customFilter),
      events: toEventDTO(result)
    });
  },


  

  myParticipations: async (req: Request, res: Response) => {

    const customFilter = { 'participants.userId': req.user._id };

    const result = await res.getModelList(Event, customFilter);

    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(Event, customFilter),
      events: toEventDTO(result)
    });
  }

};

export default eventController;