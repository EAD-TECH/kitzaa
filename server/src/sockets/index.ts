import { Server } from "socket.io";
import { socketAuth } from "./middleware/socketAuth.js"; // 1. Güvenlik Şefini import et
import type { Server as HttpServer } from "http";
import { setIO } from "./socketManager.js";

/* sadece polisi parametre olarak aldım */
export const initSocket = (httpServer: HttpServer) => {
  const allowedOrigins = [process.env.CLIENT_URL, process.env.ADMIN_URL].filter(
    (origin): origin is string => Boolean(origin),
  );

  /*  Polisi Socket.IO'ya bağla */
  const io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  setIO(io);

  /* KAPIDAKİ GÜVENLİK! (KTZ-66'nın kalbi) */
  io.use(socketAuth);

  /*   İçeri Girenleri Karşıla */
  io.on("connection", (socket) => {
    console.log(`🟢 İstemci bağlandı! Socket ID: ${socket.id}`);
    /* Cebe konulan  ID */
    console.log(`🟢 Kimliği doğrulanan Kullanıcı ID: ${socket.data.userId}`);
    const room = `user:${socket.data.userId}`;
    socket.join(`${room}`);
    console.log(`Joined room: ${room}`);

    socket.on("ping", (mesaj) => {
      console.log(`📩 İstemciden Ping geldi: "${mesaj}"`);
      socket.emit("pong", "Backend'den selamlar, garson göreve hazır!");
    });

    socket.on("disconnect", () => {
      console.log(`🔴 İstemci ayrıldı. Socket ID: ${socket.id}`);
    });
  });
};
