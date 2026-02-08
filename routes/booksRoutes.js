import express from "express";
import { getAllBooks, getBookById, createBook, updateBookById, deleteBookById } from "../controllers/booksController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get('/', getAllBooks);
router.post('/', protect, admin, upload.single('coverImage'), createBook);

router.get('/:id', getBookById);
router.put('/:id', protect, admin, updateBookById);
router.delete('/:id', protect, admin, deleteBookById);


export default router;