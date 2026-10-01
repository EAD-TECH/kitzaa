import { Socket } from "socket.io";

import jwt from "jsonwebtoken";
import CustomError from "../../helpers/customError.js";
import type { AccessTokenPayload } from "../../helpers/generateJwt.js";
export const socketAuth = (socket: Socket, next: (err?: Error) => void) => {
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
    next();
  } catch (error) {
    return next(new CustomError("Geçersiz veya süresi dolmuş token", 401));
  }
};
