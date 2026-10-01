import "dotenv/config";
import { createServer } from "http";
import app from "./server.js";

import { dbConnection } from "./src/configs/dbConnection.js";
import { errorHandler, notFound } from "./src/middlewares/errorHandler.js";
import { startEventStatusJob } from "./src/jobs/eventStatus.job.js";
import { initializeAllJobs } from "./src/jobs/index.js";
import { initSocket } from "./src/sockets/index.js";

const PORT = process.env.PORT || 3000;

const httpServer = createServer(app);

app.all("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use(notFound).use(errorHandler);

await dbConnection();

startEventStatusJob();

initializeAllJobs();
/*   Polisi Fabrikaya Gönder! (Socket.io burada polisi alır ve üstüne kendi sistemini kurar) */
initSocket(httpServer);

httpServer.listen(PORT, () => {
  console.log(`[HTTP WRAP]  Server is running on port ${PORT}`);
});
