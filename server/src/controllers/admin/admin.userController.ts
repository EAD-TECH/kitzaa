"use strict";

import type { Request, Response } from "express";
import CustomError from "../../helpers/customError.js";
import { toUserDTO } from "../../helpers/toUserDTO.js";
import User from "../../models/userModel.js";
import type {
  AdminCreateUserInput,
  AdminUpdateUserInput,
  ChangePasswordInput,
} from "../../validations/user.schema.js";
import { createAdminUser } from "../../services/adminUserService.js";
import { sendMail } from "../../mail/mail.service.js";
import { adminInviteTemplate } from "../../mail/templates/adminCreateUser.template.js";

const adminUserController = {
  create: async (
    req: Request<{}, any, AdminCreateUserInput>,
    res: Response,
  ) => {
    const validatedData = req.body;

    const { user: newUser, rawToken } = await createAdminUser(validatedData);

    try {
      await sendMail({
        to: newUser.email,
        subject: "Kitzaa daveti",
        html: adminInviteTemplate({
          firstName: newUser.firstName,
          role: newUser.role,
         setupLink: `${process.env.CLIENT_URL}/setup-account/${rawToken}`,
        }),
      });
    } catch (mailError) {
      console.error("Failed to send admin invitation email.", mailError);
      throw new CustomError(
        "E-posta gönderilemedi. Lütfen SMTP ayarlarını kontrol edin.",
        500,
      );
    }

    res.status(201).send({
      error: false,
      user: toUserDTO(newUser),
    });
  },

  list: async (req: Request, res: Response) => {
    const result = await res.getModelList(User);

    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(User),
      user: toUserDTO(result),
    });
  },

  read: async (req: Request<{ id: string }>, res: Response) => {
    const result = await User.findById(req.params.id);

    if (!result) {
      throw new CustomError("User not found", 404);
    }

    res.status(200).send({
      error: false,
      user: toUserDTO(result),
    });
  },

  update: async (
    req: Request<{ id: string }, any, AdminUpdateUserInput>,
    res: Response,
  ) => {
    const result = await User.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
      new: true,
    });

    if (!result) {
      throw new CustomError("User not found", 404);
    }

    res.status(200).send({
      error: false,
      user: toUserDTO(result),
    });
  },

  // Admin, kullaniciyi mevcut sifresini bilmeden sifirlar; bu yuzden matchPassword kontrolu yok.
  updatePassword: async (
    req: Request<{ id: string }, any, ChangePasswordInput>,
    res: Response,
  ) => {
    const user = await User.findById(req.params.id).select("+password");

    if (!user) throw new CustomError("User not found", 404);

    user.password = req.body.newPassword;
    await user.save();

    res.status(200).send({
      error: false,
      message: "Password updated successfully",
    });
  },

  deletee: async (req: Request<{ id: string }>, res: Response) => {
    const result = await User.findByIdAndDelete(req.params.id);

    if (!result) {
      throw new CustomError("User not found or already deleted.", 404);
    }

    res.sendStatus(204);
  },
};

export default adminUserController;
