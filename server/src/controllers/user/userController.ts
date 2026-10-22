"use strict";

import type { Request, Response } from "express";
import CustomError from "../../helpers/customError.js";
import { toUserDTO } from "../../helpers/toUserDTO.js";
import User from "../../models/userModel.js";
import type { UpdateUserInput, ChangePasswordInput } from "../../validations/user.schema.js";

const userController = {

  list: async (req: Request, res: Response) => {
    /*

            #swagger.tags = ['Users']
            #swagger.summary = 'List Users'
            #swagger.desription = `
                You can sen query with endpoint for filter[], search[], sort[], page and limit.
                <ul> Examples usage:
                    <li>URL/?<b>filter[field1]=value1&filter[field2]=value2</b></li>
                    <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
                    <li>URL/?<b>sort[field1]=1&sort[field2]=-1</b></li>
                    <li>URL/?<b>page=2&limit=1</b></li>
                </ul>
            `
        */

    const customFilter = req.user.role === 'admin' ? {} : { _id: req.user._id };

    const result = await res.getModelList(User, customFilter)

    if (!result) {
      throw new CustomError('User not found', 404);
    }

    const details =
      res.status(200).send({
        error: false,
        details: await res.getModelListDetails(User, customFilter),
        user: toUserDTO(result)
      })
  },


  read: async (req: Request, res: Response) => {
    /*
            #swagger.tags = ['Users']
            #swagger.summary = 'Get Single User'
        */



    const userId = req.user._id


    const result = await User.findOne({ _id: userId });


    if (!result) {
      throw new CustomError('User not found', 404);
    }



    res.status(200).send({
      error: false,
      user: toUserDTO(result)
    });
  },

  update: async (req: Request<{ id: string }, any, UpdateUserInput>, res: Response) => {
    /*
            #swagger.tags = ['Users']
            #swagger.summary = 'Update User'
        */

    const validatedData = req.body


    const userId = req.user._id

    const result = await User.findByIdAndUpdate(userId, validatedData, {
      runValidators: true,
      new: true,
    });


    res.status(200).send({
      error: false,
      user: toUserDTO(result)
    });
  },

  updatePassword: async (req: Request<{ id: string }, any, ChangePasswordInput>, res: Response) => {


    const validatedData = req.body
    const userId = req.user._id


    const user = await User.findById(userId).select("+password")


    if (!user) throw new CustomError('User not found', 404)

    const isMatch = await user.matchPassword(validatedData.currentPassword)

    if (!isMatch) throw new CustomError('Current password is incorrect', 400)

    user.password = validatedData.newPassword
    await user.save()


    res.status(200).send({
      error: false,
      message: 'Password updated successfully'
    });

  },

  deletee: async (req: Request<{ id: string }>, res: Response) => {
    /*
            #swagger.tags = ['Users']
            #swagger.summary = 'Delete User'
        */
    const userId = req.user._id;

    const result = await User.findByIdAndDelete(userId);

    if (!result) {
      throw new CustomError(
        'User not found or already deleted.',
        404
      );
    }

    res.sendStatus(204);
  }

}
export default userController;
