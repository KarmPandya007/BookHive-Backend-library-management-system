import express from "express";
import { getAllReaders, getReaderById, createReader, updateReaderById, deleteReaderById } from "../controllers/readerController.js";

const router = express.Router();

router.get('/', getAllReaders);
router.get('/:id', getReaderById);
router.post('/', createReader);
router.put('/:id', updateReaderById);
router.delete('/:id', deleteReaderById);

export default router;