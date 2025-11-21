import express from "express";
import { getAllBooks, getBookById, createBook, updateBookById, deleteBookById } from "../controllers/booksController.js";

const router = express.Router();

router.get('/', getAllBooks);
router.get('/:id', getBookById);
router.post('/', createBook);
router.put('/:id', updateBookById);
router.delete('/:id', deleteBookById);

export default router;