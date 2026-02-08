import asyncHandler from "express-async-handler";
import { Book } from "../models/Books.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";


// @desc    Get all books
// @route   GET /api/books
// @access  Public
export const getAllBooks = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [allBooks, total] = await Promise.all([
        Book.find().skip(skip).limit(limit).lean(),
        Book.estimatedDocumentCount()
    ]);

    res.status(200).json({
        success: true,
        count: allBooks.length,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        allBooks
    });
});

// @desc    Get book by ID
// @route   GET /api/books/:id
// @access  Public
export const getBookById = asyncHandler(async (req, res) => {
    const book = await Book.findById(req.params.id).lean();
    if (!book) {
        res.status(404);
        throw new Error("Book not found");
    }
    res.status(200).json({
        success: true,
        book
    });
});

// @desc    Create a book
// @route   POST /api/books
// @access  Private/Admin
export const createBook = asyncHandler(async (req, res) => {
    const { title, author, description, category, totalCopies, availableCopies, isbn, issuedCount } = req.body;

    let coverImageUrl = "";

    // If file is uploaded, upload to Cloudinary
    if (req.file) {
        try {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'bookhive/covers',
                resource_type: 'image'
            });
            coverImageUrl = result.secure_url;

            // Delete local file after upload
            fs.unlinkSync(req.file.path);
        } catch (error) {
            console.error('Cloudinary upload error:', error);
            throw new Error('Failed to upload image');
        }
    }

    const book = await Book.create({
        title,
        author,
        description,
        category,
        totalCopies,
        availableCopies,
        isbn,
        issuedCount,
        coverImage: coverImageUrl
    });

    res.status(201).json({
        success: true,
        message: "Book created successfully",
        book
    });
});

// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Private/Admin
export const updateBookById = asyncHandler(async (req, res) => {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!book) {
        res.status(404);
        throw new Error("Book not found");
    }



    res.status(200).json({
        success: true,
        message: "Book updated successfully",
        book
    });
});

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private/Admin
export const deleteBookById = asyncHandler(async (req, res) => {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
        res.status(404);
        throw new Error("Book not found");
    }

    res.status(200).json({ success: true, message: "Book deleted successfully" });
});