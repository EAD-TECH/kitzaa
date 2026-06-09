import express from 'express';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import compression from 'compression';
import queryHandler from './src/middlewares/queryHandler.js';
import logger from './src/middlewares/logger.js';

const app = express()

app.use(express.json());
app.use(cors());
app.use('/api/v1/uploads', express.static('uploads')); // Serve uploaded files

app.use(helmet());
app.use('/api/v1', rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests, please try again later.'
}));

app.use(logger);
app.use(compression({
    threshold: 1024,
    level: 6,
    filter: (req, res) => {
        if (req.headers['x-no-compression'] || req.query.nozip) {
            return false;
        } return compression.filter(req, res);
    }
}))

// Nested Query
app.set("query parser", "extended");

// Query Handler:
app.use(queryHandler);


// Auhentication:
// app.use(require('./src/middlewares/authentication'));



export default app;