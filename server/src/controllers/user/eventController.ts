"use strict";

import type { Request, Response } from "express";
import CustomError from "../../helpers/customError.js";
import { toEventDTO } from "../../helpers/toEventDTO.js";
import Event from "../../models/eventModel.js";
import type { EventDocument } from "../../types/event.types.js";
import EventCategory from "../../models/eventCategoryModel.js";
import type { CancelEventInput, CreateEventInput, JoinEventInput, NearbyQueryInput, UpdateEventInput } from "../../validations/event.schema.js";
import { assertValidTransition } from "../../helpers/eventStateMachine.js";
import {
  notifyUsersForNearbyEvent,
  notifyUsersForCancelledEvent,
} from "../../services/notificationService.js";
import User from "../../models/userModel.js";

const eventController = {

  list: async (req: Request, res: Response) => {

    const customFilter: Record<string, unknown> = { status: "approved" };

    const category = req.query.category
    const organisator = req.query.organisator

    // console.log("category", category) // familie,bildung,sport

    if (typeof category === "string" && category.length > 0) {
      const slugs = category.split(",");
      const categories = await EventCategory.find({ slug: { $in: slugs } }).select("_id");
      customFilter.categoryId = { $in: categories.map((c) => c._id) };
    }

    if (typeof organisator === "string" && organisator.length > 0) {
      const validRoles = ["organizer", "user"] as const;
      const roles = organisator.split(",").filter((r): r is "organizer" | "user" =>
        (validRoles as readonly string[]).includes(r)
      );
      const organisators = await User.find({ role: { $in: roles } }).select("_id");
      customFilter.createdBy = { $in: organisators.map((o) => o._id) };
    }

    const lat = req.query.lat;
    const lng = req.query.lng;
    const radius = req.query.radius;

    if (typeof lat === "string" && typeof lng === "string" && typeof radius === "string") {
      const latNum = Number(lat);
      const lngNum = Number(lng);
      const radiusKm = Number(radius);

      const isValid =
        Number.isFinite(latNum) && latNum >= -90 && latNum <= 90 &&
        Number.isFinite(lngNum) && lngNum >= -180 && lngNum <= 180 &&
        Number.isFinite(radiusKm) && radiusKm > 0 && radiusKm <= 50;

      if (isValid) {
        const EARTH_RADIUS_KM = 6378.1;
        customFilter["location.coordinates"] = {
          $geoWithin: {
            $centerSphere: [[lngNum, latNum], radiusKm / EARTH_RADIUS_KM],
          },
        };
      }
    }

    const result = await res.getModelList(Event, customFilter, [
      { path: "categoryId", select: "name slug icon" },
      { path: "createdBy", select: "username avatarUrl role" },
    ]);

    console.log("result", result);

    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(Event, customFilter),
      events: toEventDTO(result),
    });
  },

  nearby: async (req: Request, res: Response) => {
    const { lat, lng, radius } = req.validatedQuery as NearbyQueryInput;

    const events = await Event.find({
      status: 'approved',
      'location.coordinates': {
        $near: {
          $geometry: { type: 'Point', coordinates: [lng, lat] }, // nereye göre yakinlik olcucez.
          $maxDistance: radius,
        },
      },
    }).populate([
      { path: 'categoryId', select: 'name slug icon' },
      { path: 'createdBy', select: 'username avatarUrl role' },
    ]);

    res.status(200).send({
      error: false,
      events: toEventDTO(events),
    });
  },


  read: async (req: Request<{ slug: string }>, res: Response) => {
    const result = await Event.findOneAndUpdate(
      { slug: req.params.slug, status: "approved" },
      { $inc: { viewCount: 1 } },
      { new: true },
    ).populate([
      { path: "categoryId", select: "name slug icon" },
      { path: "createdBy", select: "username avatarUrl role" },
      { path: "participants.userId", select: "username avatarUrl" },
    ]);

    if (!result) {
      throw new CustomError("Event not found", 404);
    }

    res.status(200).send({
      error: false,
      event: toEventDTO(result),
    });
  },

  create: async (req: Request<{}, any, CreateEventInput>, res: Response) => {
    const validatedData = req.body;

    if (!validatedData.isFree && req.user.role === "user") {
      throw new CustomError(
        "You must be an organizer to create paid events.",
        403,
      );
    }

    const newEvent = await Event.create({
      ...validatedData,
      coverImage: validatedData.coverImage ?? validatedData.images[0] ?? null,
      createdBy: req.user._id,
    });

    /* olusturulan yenı etkınlık db ye gıderken aynı anda await olmadan kullanıcıya bıldırım atmak */
    console.log("API Yanıtı dönüyor, arka planda KTZ-58 motoru ateşleniyor.");
    notifyUsersForNearbyEvent(newEvent);

    res.status(201).send({
      error: false,
      event: toEventDTO(newEvent),
    });
  },

  update: async (
    req: Request<{ id: string }, any, UpdateEventInput>,
    res: Response,
  ) => {
    // isOwnerOrAdmin middleware'i sahiplik/admin kontrolunu yapip event'i req.resource'a koyuyor.
    const event = req.resource as EventDocument;

    Object.assign(event, req.body);
    await event.save();

    res.status(200).send({
      error: false,
      event: toEventDTO(event),
    });
  },

  deletee: async (
    req: Request<{ id: string }, any, CancelEventInput>,
    res: Response,
  ) => {
    // isOwnerOrAdmin middleware'i sahiplik/admin kontrolunu yapip event'i req.resource'a koyuyor.
    const event = req.resource as EventDocument;

    assertValidTransition(event.status, "cancelled");

    event.status = "cancelled";
    await event.save();

    console.log(
      "API Yanıtı dönüyor, arka planda KTZ-61 motoru ateşleniyor",
    );
    notifyUsersForCancelledEvent(event);


    res.sendStatus(204);
  },

  join: async (req: Request<{ id: string }, any, JoinEventInput>, res: Response) => {

    const { participantCount } = req.body;

    const event = await Event.findById(req.params.id);

    if (!event) {
      throw new CustomError("Event not found", 404);
    }

    if (event.status !== "approved") {
      throw new CustomError("You can only join approved events.", 400);
    }

    const alreadyJoined = event.participants?.some((p) =>
      p.userId.equals(req.user._id),
    );

    if (alreadyJoined) {
      throw new CustomError("You have already joined this event.", 409);
    }

    if (event.capacity.current + participantCount > event.capacity.max) {
      throw new CustomError("This event is full.", 409);
    }

    const updatedEvent = await Event.findOneAndUpdate(
      {
        _id: event._id,
        status: "approved",
        "participants.userId": { $ne: req.user._id },
        $expr: { $lte: [{ $add: ["$capacity.current", participantCount] }, "$capacity.max"] },
      },
      {
        $push: {
          participants: {
            userId: req.user._id,
            status: "confirmed",
            participantCount,
            joinedAt: new Date(),
          },
        },
        $inc: { "capacity.current": participantCount },
      },
      { new: true },
    ).populate("participants.userId", "username avatarUrl");

    if (!updatedEvent) {
      throw new CustomError(
        "This event is full or you have already joined.",
        409,
      );
    }

    res.status(200).send({
      error: false,
      event: toEventDTO(updatedEvent),
    });
  },

  leave: async (req: Request<{ id: string }>, res: Response) => {
    const event = await Event.findById(req.params.id);

    if (!event) {
      throw new CustomError("Event not found", 404);
    }

    const participant = event.participants?.find((p) =>
      p.userId.equals(req.user._id),
    );

    if (!participant) {
      throw new CustomError("You have not joined this event.", 400);
    }

    const updatedEvent = await Event.findOneAndUpdate(
      {
        _id: event._id,
        "participants.userId": req.user._id,
      },
      {
        $pull: { participants: { userId: req.user._id } },
        $inc: { "capacity.current": -participant.participantCount },
      },
      { new: true },
    ).populate("participants.userId", "username avatarUrl");

    if (!updatedEvent) {
      throw new CustomError("You have not joined this event.", 400);
    }

    res.status(200).send({
      error: false,
      event: toEventDTO(updatedEvent),
    });
  },

  toggleLike: async (req: Request<{ id: string }>, res: Response) => {
    const eventId = req.params.id;
    const userId = req.user._id;

    const event = await Event.findById(req.params.id);

    if (!event) {
      throw new CustomError("Event not found", 404);
    }

    const alreadyLiked = event.likes?.some((id) => id.equals(userId)) ?? false;

    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      alreadyLiked
        ? { $pull: { likes: userId } }
        : { $addToSet: { likes: userId } },
      { new: true },
    );

    res.status(200).json({
      error: false,
      liked: !alreadyLiked,
      event: toEventDTO(updatedEvent),
    });
  },

  toggleSave: async (req: Request<{ id: string }>, res: Response) => {

    const eventId = req.params.id
    const userId = req.user._id

    const event = await Event.findById(eventId)

    if (!event) {
      throw new CustomError("Event not found", 404);
    }

    const user = await User.findById(userId)

    const alreadySaved = user?.savedEvents?.some((id) => id.equals(eventId) ?? false)

    await User.findByIdAndUpdate(
      userId,
      alreadySaved
        ? { $pull: { savedEvents: eventId } }
        : { $addToSet: { savedEvents: eventId } }
    )


    res.status(200).json({
      error: false,
      saved: !alreadySaved,
    });

  },

  participants: async (req: Request<{ id: string }>, res: Response) => {
    // Artik owner/admin'e ozel degil — herhangi bir giris yapmis kullanici cagirabilir,
    // bu yuzden event'i (isOwnerOrAdmin'in yaptigi gibi) kendimiz cekiyoruz.
    const event = await Event.findById(req.params.id).populate(
      "participants.userId",
      "username avatarUrl",
    );

    if (!event) {
      throw new CustomError("Event not found", 404);
    }

    res.status(200).send({
      error: false,
      participants: event.participants ?? [],
    });
  },
  

  myEvents: async (req: Request, res: Response) => {
    const customFilter = { createdBy: req.user._id };

    const result = await res.getModelList(Event, customFilter);

    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(Event, customFilter),
      events: toEventDTO(result),
    });
  },




  myParticipations: async (req: Request, res: Response) => {
    const customFilter = { "participants.userId": req.user._id };

    const result = await res.getModelList(Event, customFilter);

    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(Event, customFilter),
      events: toEventDTO(result),
    });
  },
};

export default eventController;
