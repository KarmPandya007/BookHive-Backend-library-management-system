import express from 'express';
import cors from 'cors'
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import booksRoutes from './routes/booksRoutes.js';
import readersRoutes from './routes/readersRoutes.js';

const app = express();

dotenv.config();

await connectDB();


// CORS configuration
const allowedOrigins = [
    "http://localhost:3000",
    "https://book-hive-frontend-library-manageme.vercel.app"
];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);

        // Check if origin matches allowed origins (normalized)
        const normalizedOrigin = origin.replace(/\/$/, '');
        const isAllowed = allowedOrigins.some(allowed => allowed.replace(/\/$/, '') === normalizedOrigin);

        if (isAllowed) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: "GET,POST,PUT,DELETE",
    credentials: true
}));
app.use(express.json())

app.get('/', (req, res) => {
    res.send("Library API is running...");
})

// Books API Routes
app.use('/api/books', booksRoutes);
app.use('/api/readers', readersRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server running on port http://localhost:${process.env.PORT}`);
})