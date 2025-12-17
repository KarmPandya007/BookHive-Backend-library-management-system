import express from "express";
import { getAllReaders, getReaderById, registerReader, updateReaderById, deleteReaderById, deleteAllReaders } from "../controllers/readerController.js";

const router = express.Router();

router.get('/', getAllReaders);
router.get('/:id', getReaderById);
router.post('/register', registerReader);
router.put('/:id', updateReaderById);
router.delete('/:id', deleteReaderById);
router.delete('/', deleteAllReaders);

export default router;