import "dotenv/config";

import app from './server.js';
import { errorHandler, notFound } from './src/middlewares/errorHandler.js';

const PORT = process.env.PORT || 3000;

app.all("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

app.use(notFound).use(errorHandler);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});