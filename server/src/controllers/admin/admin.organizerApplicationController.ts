"use strict";

import type { Request, Response } from "express";
import CustomError from "../../helpers/customError.js";
import { generateUniqueSlug } from "../../helpers/slugify.js";
import { toOrganizerApplicationDTO } from "../../helpers/toOrganizerApplicationDTO.js";
import { sendMail } from "../../mail/mail.service.js";
import { organizerApplicationApprovedTemplate } from "../../mail/templates/organizerApplicationApproved.template.js";
import { organizerApplicationRejectedTemplate } from "../../mail/templates/organizerApplicationRejected.template.js";
import Institution from "../../models/institutionModel.js";
import OrganizerApplication from "../../models/organizerApplicationModel.js";
import User from "../../models/userModel.js";
import type { RejectApplicationInput } from "../../validations/organizerApplication.schema.js";

const organizerApplicationController = {
  list: async (req: Request, res: Response) => {
    const category =
      typeof req.query.category === "string"
        ? req.query.category.trim()
        : undefined;

    const customFilter = category
      ? { "institutionData.category": category }
      : {};

    const result = await res.getModelList(OrganizerApplication, customFilter);

    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(
        OrganizerApplication,
        customFilter,
      ),
      applications: toOrganizerApplicationDTO(result),
    });
  },

  read: async (req: Request<{ id: string }>, res: Response) => {
    const result = await OrganizerApplication.findById(req.params.id);

    if (!result) {
      throw new CustomError("Application not found", 404);
    }

    res.status(200).send({
      error: false,
      application: toOrganizerApplicationDTO(result),
    });
  },

  approve: async (req: Request<{ id: string }>, res: Response) => {
    const application = await OrganizerApplication.findById(req.params.id);

    if (!application) {
      throw new CustomError("Application not found", 404);
    }

    if (
      !["pending", "under_review", "needs_more_info"].includes(
        application.status,
      )
    ) {
      throw new CustomError(
        "Application cannot be approved in its current status.",
        400,
      );
    }

    const user = await User.findById(application.userId);

    if (!user) {
      throw new CustomError("Applicant user not found", 404);
    }

    if (user.role !== "user") {
      throw new CustomError("User is already an organizer or admin.", 400);
    }

    const existingInstitution = await Institution.findOne({
      ownerId: user._id,
    });
    if (existingInstitution) {
      throw new CustomError("User already has an institution.", 409);
    }

    const slug = await generateUniqueSlug(
      application.institutionData.name,
      async (value) => {
        const exists = await Institution.findOne({ slug: value });
        return Boolean(exists);
      },
    );

    const institution = await Institution.create({
      ownerId: user._id,
      applicationId: application._id,
      name: application.institutionData.name,
      slug,
      description: application.institutionData.description ?? null,
      address: application.institutionData.address ?? null,
      phone: application.institutionData.phone ?? null,
      website: application.institutionData.website ?? null,
      category: application.institutionData.category ?? null,
      status: "active",
    });

    application.status = "approved";
    application.reviewedBy = req.user._id;
    application.reviewerType = "admin";
    application.reviewedAt = new Date();
    application.rejectedReason = null;
    application.statusHistory.push({
      status: "approved",
      changedBy: req.user._id,
      changedAt: new Date(),
      note: null,
    });
    await application.save();

    user.role = "organizer";
    user.institutionId = institution._id;
    user.refreshToken = null;
    await user.save();

    try {
      await sendMail({
        to: user.email,
        subject: "Organisator-Antrag genehmigt",
        html: organizerApplicationApprovedTemplate({
          username: user.username,
          institutionName: institution.name,
        }),
      });
    } catch (error) {
      console.log("Failed to send email.", error);
    }

    res.status(200).send({
      error: false,
      message: "Application approved.",
      application: toOrganizerApplicationDTO(application),
      institution: {
        _id: institution._id,
        name: institution.name,
        slug: institution.slug,
        ownerId: institution.ownerId,
        applicationId: institution.applicationId,
        status: institution.status,
      },
    });
  },

  reject: async (
    req: Request<{ id: string }, any, RejectApplicationInput>,
    res: Response,
  ) => {
    const { rejectedReason } = req.body;
    const application = await OrganizerApplication.findById(req.params.id);

    if (!application) {
      throw new CustomError("Application not found", 404);
    }

    if (
      !["pending", "under_review", "needs_more_info"].includes(
        application.status,
      )
    ) {
      throw new CustomError(
        "Application cannot be rejected in its current status.",
        400,
      );
    }

    const user = await User.findById(application.userId);

    if (!user) {
      throw new CustomError("Applicant user not found", 404);
    }

    if (user.role !== "user") {
      throw new CustomError("User is already an organizer or admin.", 400);
    }

    application.status = "rejected";
    application.reviewedBy = req.user._id;
    application.reviewerType = "admin";
    application.reviewedAt = new Date();
    application.rejectedReason = rejectedReason;
    application.statusHistory.push({
      status: "rejected",
      changedBy: req.user._id,
      changedAt: new Date(),
      note: rejectedReason,
    });
    await application.save();

    try {
      await sendMail({
        to: user.email,
        subject: "Organisator-Antrag abgelehnt",
        html: organizerApplicationRejectedTemplate({
          username: user.username,
          institutionName: application.institutionData.name,
          rejectedReason,
        }),
      });
    } catch (error) {
      console.log("Failed to send email.", error);
    }

    res.status(200).send({
      error: false,
      message: "Application rejected.",
      application: toOrganizerApplicationDTO(application),
    });
  },
};

export default organizerApplicationController;
