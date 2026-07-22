"use strict"

import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import CustomError from "../helpers/customError.js"
import type { AccessTokenPayload } from "../helpers/generateJwt.js";

const authentication = async (req: Request, res: Response, next: NextFunction) => {

    const authHeader = req.headers.authorization

    console.log('authHeader', authHeader)

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new CustomError('AuthenticationError: Token not found.', 401)
    }

    const token = authHeader.split(' ')[1]

    if (!token) {
        throw new CustomError('AuthenticationError: Token not found.', 401)
    }

    let decoded: AccessTokenPayload;

    try {
        decoded = jwt.verify(token, process.env.ACCESS_KEY!) as AccessTokenPayload;
    } catch {
        throw new CustomError("Invalid or expired token.", 401);
    }


    const user = await User.findById(decoded._id)

    console.log('decoded token', decoded)

    if (!user) {
        throw new CustomError('User not found', 401)
    }

    if (!user.isActive) {
        throw new CustomError('User is not active.', 403)
    }

    req.user = user

    next()
}

export default authentication
