import express from "express";
import { getAllBooks, getBookById, createBook, updateBookById, deleteBookById } from "../controllers/booksController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.route('/')
    .get(getAllBooks)
    .post(protect, admin, upload.single('coverImage'), createBook);

router.route('/:id')
    .get(getBookById)
    .put(protect, admin, updateBookById)
    .delete(protect, admin, deleteBookById);


export default router;