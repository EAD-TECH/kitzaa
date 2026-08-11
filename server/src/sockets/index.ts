import { Server } from "socket.io"; 
import { socketAuth } from "./middleware/socketAuth.js"; // 1. Güvenlik Şefini import et
import type { Server as HttpServer } from "http";

/* sadece polisi parametre olarak aldım */
export const initSocket = (httpServer: HttpServer) => { 
  
  /*  Polisi Socket.IO'ya bağla */
  const io = new Server(httpServer, {
    cors: {
      origin: "*", 
      methods: ["GET", "POST"],
    },
  });
 

  /* KAPIDAKİ GÜVENLİK! (KTZ-66'nın kalbi) */
  io.use(socketAuth); 

  /*   İçeri Girenleri Karşıla */
  io.on("connection", (socket) => {
    console.log(`🟢 İstemci bağlandı! Socket ID: ${socket.id}`);
    console.log(`🟢 Kimliği doğrulanan Kullanıcı ID: ${socket.data.userId}`); // Cebine koyduğumuz ID

    socket.on("ping", (mesaj) => {
      console.log(`📩 İstemciden Ping geldi: "${mesaj}"`);
      socket.emit("pong", "Backend'den selamlar, garson göreve hazır!");
    });

    socket.on("disconnect", () => {
      console.log(`🔴 İstemci ayrıldı. Socket ID: ${socket.id}`);
    });
  });
};