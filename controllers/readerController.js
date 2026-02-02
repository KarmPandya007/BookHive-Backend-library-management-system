import asyncHandler from "express-async-handler";
import { Reader } from "../models/Readers.js";

// @desc    Get all readers
// @route   GET /api/readers
// @access  Private/Admin
export const getAllReaders = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [readers, total] = await Promise.all([
        Reader.find({}).skip(skip).limit(limit).lean(),
        Reader.countDocuments()
    ]);

    res.status(200).json({
        success: true,
        count: readers.length,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        readers
    });
});

// @desc    Get reader by ID
// @route   GET /api/readers/:id
// @access  Private
export const getReaderById = asyncHandler(async (req, res) => {
    const reader = await Reader.findById(req.params.id).lean();
    if (!reader) {
        res.status(404);
        throw new Error("Reader not found");
    }
    res.status(200).json({ success: true, reader });
});

// @desc    Update reader
// @route   PUT /api/readers/:id
// @access  Private
export const updateReaderById = asyncHandler(async (req, res) => {
    const reader = await Reader.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!reader) {
        res.status(404);
        throw new Error("Reader not found");
    }

    res.status(200).json({ success: true, message: "Reader updated successfully", reader });
});

// @desc    Delete reader
// @route   DELETE /api/readers/:id
// @access  Private/Admin
export const deleteReaderById = asyncHandler(async (req, res) => {
    const reader = await Reader.findByIdAndDelete(req.params.id);
    if (!reader) {
        res.status(404);
        throw new Error("Reader not found");
    }
    res.status(200).json({ success: true, message: "Reader deleted successfully" });
});

// @desc    Delete all readers
// @route   DELETE /api/readers
// @access  Private/Admin
export const deleteAllReaders = asyncHandler(async (req, res) => {
    const result = await Reader.deleteMany({});
    if (result.deletedCount === 0) {
        res.status(404);
        throw new Error("No readers found to delete.");
    }
    res.status(200).json({ success: true, message: "All readers deleted successfully." });
});

// @desc    Register a new reader
// @route   POST /api/readers/register
// @access  Public
export const registerReader = asyncHandler(async (req, res) => {
    const { name, email, phone, address, id, password } = req.body;

    const readerExists = await Reader.findOne({
        $or: [{ email }, { phone }, { id }]
    }).select('_id').lean();

    if (readerExists) {
        res.status(400);
        throw new Error("Reader with this email, phone, or ID already exists.");
    }

    const newReader = await Reader.create({ name, email, phone, address, id, password });

    if (newReader) {
        res.status(201).json({
            success: true,
            message: "Reader successfully registered.",
            reader: {
                _id: newReader._id,
                name: newReader.name,
                email: newReader.email,
                id: newReader.id
            }
        });
    } else {
        res.status(400);
        throw new Error("Invalid reader data");
    }
});