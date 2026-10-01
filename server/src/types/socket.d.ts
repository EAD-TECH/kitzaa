import type { Types } from "mongoose";

declare module "socket.io" {
  interface SocketData {
    userId: Types.ObjectId | string;
  }
}
