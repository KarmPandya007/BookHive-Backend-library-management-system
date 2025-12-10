import express from 'express';
import cors from 'cors'
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import booksRoutes from './routes/booksRoutes.js';
import readersRoutes from './routes/readersRoutes.js';

const app = express();

dotenv.config();

await connectDB();


// https://book-hive-frontend-library-manageme.vercel.app
app.use(cors({
    origin: [
        "http://localhost:3000",
        "http://localhost:5173",
        "https://bookhive-library-management-portal.vercel.app",
        "https://book-hive-frontend-library-manageme.vercel.app"
    ],
    methods: "GET,POST,PUT,DELETE",
    credentials: true
}));
app.use(express.json())

app.get('/', (req, res)=>{
    res.send("Library API is running...");
})

// Books API Routes
app.use('/api/books', booksRoutes);
app.use('/api/readers', readersRoutes);

app.listen(process.env.PORT, ()=>{
    console.log(`Server running on port http://localhost:${process.env.PORT}`);
})