"use strict";

import type { Request, Response } from "express";
import CustomError from "../../helpers/customError.js";
import { toUserDTO } from "../../helpers/toUserDTO.js";
import User from "../../models/userModel.js";
import type { AdminCreateUserInput, AdminUpdateUserInput, ChangePasswordInput } from "../../validations/user.schema.js";

const adminUserController = {

  create: async (req: Request<{}, any, AdminCreateUserInput>, res: Response) => {
    const validatedData = req.body;

    const userExists = await User.findOne({
      $or: [{ email: validatedData.email }, { username: validatedData.username }],
    });

    if (userExists) {
      throw new CustomError('Email or username is already registered.', 409);
    }

    const newUser = await User.create(validatedData);

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
      user: toUserDTO(result)
    });
  },

  read: async (req: Request<{ id: string }>, res: Response) => {
    const result = await User.findById(req.params.id);

    if (!result) {
      throw new CustomError('User not found', 404);
    }

    res.status(200).send({
      error: false,
      user: toUserDTO(result)
    });
  },

  update: async (req: Request<{ id: string }, any, AdminUpdateUserInput>, res: Response) => {
    const result = await User.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
      new: true,
    });

    if (!result) {
      throw new CustomError('User not found', 404);
    }

    res.status(200).send({
      error: false,
      user: toUserDTO(result)
    });
  },

  // Admin, kullaniciyi mevcut sifresini bilmeden sifirlar; bu yuzden matchPassword kontrolu yok.
  updatePassword: async (req: Request<{ id: string }, any, ChangePasswordInput>, res: Response) => {
    const user = await User.findById(req.params.id).select("+password");

    if (!user) throw new CustomError('User not found', 404);

    user.password = req.body.newPassword;
    await user.save();

    res.status(200).send({
      error: false,
      message: 'Password updated successfully'
    });
  },

  deletee: async (req: Request<{ id: string }>, res: Response) => {
    const result = await User.findByIdAndDelete(req.params.id);

    if (!result) {
      throw new CustomError('User not found or already deleted.', 404);
    }

    res.sendStatus(204);
  }

};

export default adminUserController;
