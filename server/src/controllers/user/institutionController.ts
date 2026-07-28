"use strict";

import type { Request, Response } from "express";
import CustomError from "../../helpers/customError.js";
import { generateUniqueSlug } from "../../helpers/slugify.js";
import { toInstitutionDTO } from "../../helpers/toInstitutionDTO.js";
import Institution from "../../models/institutionModel.js";
import type { UpdateInstitutionInput } from "../../validations/institution.schema.js";

const institutionController = {
  me: async (req: Request, res: Response) => {
    const institution = await Institution.findOne({ ownerId: req.user._id });

    if (!institution) {
      throw new CustomError("Institution not found", 404);
    }

    res.status(200).send({
      error: false,
      institution: toInstitutionDTO(institution),
    });
  },

  update: async (req: Request<{}, any, UpdateInstitutionInput>, res: Response) => {
    const institution = await Institution.findOne({ ownerId: req.user._id });

    if (!institution) {
      throw new CustomError("Institution not found", 404);
    }

    const { name, description, address, phone, website, category, logoUrl } = req.body;

    if (name !== undefined && name !== institution.name) {
      institution.name = name;
      institution.slug = await generateUniqueSlug(name, async (value) => {
        const exists = await Institution.findOne({
          slug: value,
          _id: { $ne: institution._id },
        });
        return Boolean(exists);
      });
    }

    if (description !== undefined) institution.description = description;
    if (address !== undefined) institution.address = address;
    if (phone !== undefined) institution.phone = phone;
    if (website !== undefined) institution.website = website;
    if (category !== undefined) institution.category = category;
    if (logoUrl !== undefined) institution.logoUrl = logoUrl;

    await institution.save();

    res.status(200).send({
      error: false,
      message: "Institution updated.",
      institution: toInstitutionDTO(institution),
    });
  },
};

export default institutionController;
