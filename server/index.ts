import "dotenv/config";

import app from "./server.js";

import { dbConnection } from "./src/configs/dbConnection.js";
import { errorHandler, notFound } from "./src/middlewares/errorHandler.js";
import { startEventStatusJob } from "./src/jobs/eventStatus.job.js";
import { initializeAllJobs } from "./src/jobs/index.js";
import { createServer } from "http";
import { Server } from "socket.io"; //socket.io import

const PORT = process.env.PORT || 3000;
const httpServer = createServer(app);

// 2. Socket.io Sunucusunu Başlat ve CORS ayarlarını ver
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Şimdilik test için her yere açık
    methods: ["GET", "POST"],
  },
});

// 3. PING-PONG Test Mimarisi
io.on("connection", (socket) => {
  console.log(`🟢 Yeni bir istemci (client) bağlandı! Socket ID: ${socket.id}`);
  // Frontend'den 'ping' adında bir olay gelirse dinle
  socket.on("ping", (mesaj) => {
    console.log(`📩 İstemciden Ping geldi: "${mesaj}"`);

    // Frontend'e 'pong' adında bir cevap fırlat (emit)
    socket.emit("pong", "Backend'den selamlar, garson göreve hazır!");
  });
  // İstemci bağlantıyı kestiğinde (sekme kapandığında) dinle
  socket.on("disconnect", () => {
    console.log(`🔴 İstemci ayrıldı. Socket ID: ${socket.id}`);
  });
});

app.all("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use(notFound).use(errorHandler);

await dbConnection();

startEventStatusJob();

initializeAllJobs();

httpServer.listen(PORT, () => {
  console.log(`[HTTP WRAP]  Server is running on port ${PORT}`);
});