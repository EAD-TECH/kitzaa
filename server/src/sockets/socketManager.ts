import CustomError from "../helpers/customError.js"
import type { Server } from "socket.io";

let io: Server | null

/*  baglantı gelırse setIO ya koyuyorm */ 


export const setIO=(ioInstance:Server)  =>{
  io=ioInstance

}

export const getIO = (): Server => {
  if (!io) {
   throw  new CustomError("Socket.io henüz init edilmedi. Önce initSocket çağır.");
  }
  return io;
};


