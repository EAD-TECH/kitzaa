import { Socket } from "socket.io";

import jwt from "jsonwebtoken";
import CustomError from "../../helpers/customError.js";
import type { AccessTokenPayload } from "../../helpers/generateJwt.js";
import User from "../../models/userModel.js";

export const socketAuth = async (
  socket: Socket,
  next: (err?: Error) => void,
) => {
  console.log("gelen kişiyi kontrlet.");
  try {
    const token = socket.handshake.auth.token as string | undefined;

    if (!token) {
      return next(new CustomError("Token bulunamadı", 401));
    }

    const decoded = jwt.verify(
      token,
      process.env.ACCESS_KEY as string,
    ) as AccessTokenPayload;

    socket.data.userId = String(decoded._id);
    socket.data.role = String(decoded.role);

    const dbUser = await User.findById(decoded._id).select(
      "firstName lastName avatarUrl",
    );

    if (!dbUser) {
      throw new CustomError("Kullanıcı bulunumadı", 403);
    }

    socket.data.firstName = dbUser.firstName;
    socket.data.lastName = dbUser.lastName;
    socket.data.avatarUrl = dbUser.avatarUrl;

    next();
  } catch (error) {
    return next(new CustomError("Geçersiz veya süresi dolmuş token", 401));
  }
};
