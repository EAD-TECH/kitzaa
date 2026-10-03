import { Server } from "socket.io";
import { socketAuth } from "./middleware/socketAuth.js";
import type { Server as HttpServer } from "http";
import { setIO } from "./socketManager.js";
import {
  handleChatSessionRequest,
  handleSupportRequest,
  handleSendMessage,
} from "../controllers/socket/ConversationController.js";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

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
  const onlineUsers = new Map();
  /* aksiyonlar ıcın bos dızı tanımlaıyorm KTZ-232*/
  const recentActivities: Array<Record<string, unknown>> = [];

  /*   İçeri Girenleri Karşıla */
  io.on("connection", (socket) => {
    const room = `user:${socket.data.userId}`;
    socket.join(`${room}`);

    if (socket.data.role !== "admin") {
      onlineUsers.set(socket.data.userId, {
        id: socket.data.userId,
        socketId: socket.id,
        role: socket.data.role,
        firstName: socket.data.firstName,
        lastName: socket.data.lastName,
        avatarUrl: socket.data.avatarUrl,
        currentPath: "/",
      });
    }

    socket.on("update_path", (newPath) => {
      const user = onlineUsers.get(socket.data.userId);

      if (user) {
        user.currentPath = newPath;
      }
      io.to("admins_room").emit(
        "online_users_update",
        Array.from(onlineUsers.values()),
      );
      console.log(onlineUsers, "baglananların sayısını gorucm ");
    });

    /* eger baglanan kısı admın ıse onu admınlerın oldugu odaya alıcm */
    if (socket.data.role === "admin") {
      /* console.log("admin yetkılı kısısı baglandı"); */
      /* onu ozel odaya alıyorm */
      socket.join("admins_room");
      socket.emit("activity_snapshot", recentActivities);
      /*  console.log("admin odaya alındı"); */
    }
    io.to("admins_room").emit(
      "online_users_update",
      Array.from(onlineUsers.values()),
    );

    /* normal kullanıcıdan gelen aksıyonları dınlemem lazım */

    socket.on("user_action", (clientData) => {
      console.log("dinleme cıhazımı taktım");
      const activityPayload = {
        id: crypto.randomUUID(),
        title: clientData.title,
        description: clientData.description,
        time: new Date().toLocaleTimeString("en-EN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        relatedId: clientData.relatedId || socket.data.userId,
        linkUrl: clientData.linkUrl,
        type: clientData.type,
        isRead: false,
      };

      recentActivities.unshift(activityPayload);

      if (recentActivities.length > 50) {
        recentActivities.pop();
      }
      console.log("kutunun boyutu", recentActivities.length);

      io.to("admins_room").emit("new_activity", activityPayload);
      console.log("admin odasına fırlattım");
    });

    socket.on("ping", (mesaj) => {
      socket.emit("pong", "Backend'den selamlar, garson göreve hazır!");
    });
    socket.on("request_chat_session", (payload) => {
      console.log(`Sohbet talebi geldi. Hedef ID: ${payload.targetId}`);
      /* controlrıa paslıyorm */
      handleChatSessionRequest(io, socket, payload);
    });
    socket.on("request_support", (payload) => {
      handleSupportRequest(io, socket, payload);
    });
    socket.on("send_message", (payload) => {
      console.log("admının yoladıgı mesaj", payload);
      /* controlrıa paslıyorm */
      handleSendMessage(io, socket, payload);
    });

    socket.on("join_chat_room", async (payload) => {
      if (payload.roomId) {
        socket.join(payload.roomId);
        console.log("user adminin daveti ile odaya katildi");
      }
      if (socket.data.role === "admin") {
        /* admin odaya gırdı agentın fısını cek */
        await Conversation.findByIdAndUpdate(payload.roomId, {
          isAgentActive: false,
        });
        /* admin devre dısı user-agent konusmalarını admıne pasla */
        const rawHistory = await Message.find({
          conversationId: payload.roomId,
        })/* .sort({ createdAt: -1 }) */;

        const formattedHistory = rawHistory.map((msg) => ({
          id: msg._id.toString(),
          senderId: msg.senderId,
          senderName:
            msg.senderType === "admin"
              ? msg.senderId.toString() === "000000000000000000000000"
                ? "Kitzaa Asistan"
                : "Admin"
              : "Kullanıcı",
          senderType: msg.senderType,
          text: msg.content,
          roomId: msg.conversationId.toString(),
          timestamp: msg.createdAt,
        }));

        socket.emit("load_chat_history", formattedHistory);
      }
    });
    socket.on("leave_chat_room", (payload) => {
      if (payload.roomId) {
        socket.leave(payload.roomId);
        console.log(
          `Socket ${socket.id}, ${payload.roomId} odasından ayrıldı.`,
        );
      }
    });

    socket.on("disconnect", () => {
      /* dæsconnect olunca kayit defterinden kullaniciyi sil */
      const current = onlineUsers.get(socket.data.userId);
      if (current?.socketId === socket.id) {
        onlineUsers.delete(socket.data.userId);
        io.to("admins_room").emit(
          "online_users_update",
          Array.from(onlineUsers.values()),
        );
      }
    });
  });
};
