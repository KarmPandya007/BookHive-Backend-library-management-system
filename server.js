import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import compression from 'compression';
import helmet from 'helmet';
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import booksRoutes from './routes/booksRoutes.js';
import readersRoutes from './routes/readersRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

// Connect to Database
await connectDB();

const app = express();

// Security and Performance Middleware
app.use(helmet()); // Secure headers
app.use(compression()); // Gzip compression
app.use(express.json({ limit: '10kb' })); // Body parser with limit
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// CORS configuration
const allowedOrigins = [
    "http://localhost:3000",
    "https://book-hive-frontend-library-manageme.vercel.app"
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        const normalizedOrigin = origin.replace(/\/$/, '');
        if (allowedOrigins.map(o => o.replace(/\/$/, '')).includes(normalizedOrigin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: "GET,POST,PUT,DELETE",
    credentials: true
}));

// API Routes
app.get('/', (req, res) => {
    res.status(200).json({ message: "Library API is running..." });
});

app.use('/api/books', booksRoutes);
app.use('/api/readers', readersRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port http://localhost:${PORT}`);
});