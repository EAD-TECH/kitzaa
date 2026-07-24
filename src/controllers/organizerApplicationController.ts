"use strict";

import type { Request, Response } from "express";
import CustomError from "../helpers/customError.js";
import { toOrganizerApplicationDTO } from "../helpers/toOrganizerApplicationDTO.js";
import OrganizerApplication from "../models/organizerApplicationModel.js";
import type {ApplyOrganizerInput  } from "../validations/organizerApplication.schema.js";

const OrganizerApplicationController = {

  apply: async (req: Request<{}, any, ApplyOrganizerInput>, res: Response) => {

    const { institutionData, message } = req.body;

    const userId = req.user._id;

    //Burlari ilk basta controller da yazdim ama daha sonra bunlar middleware e tasinacak.
    if (req.user.role !== "user") {
      throw new CustomError("You are already an organizer or admin.", 403);
    }
    
    // if (!req.user.isEmailVerified) {
    //   throw new CustomError("Please verify your email before applying.", 403);
    // }

    const activeApplication = await OrganizerApplication.findOne({
      userId,
      status: { $in: ['pending', 'under_review', 'needs_more_info']},
    });

    if (activeApplication) throw new CustomError("You already have an application in progress.", 409);

    const application = await OrganizerApplication.create({
      userId,
      institutionData,
      message,
      status:"pending",
      statusHistory: [{ status: "pending", changedBy: userId,  changedAt: new Date()}]
    });

    res.status(201).send({
      error: false,
      message: "Your application has been submitted.",
      application: toOrganizerApplicationDTO(application),
    });
  },
}
export default OrganizerApplicationController;
