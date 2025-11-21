import express from "express";
import { Book } from "../models/Books.js";

export const getAllBooks = async (req, res) => {
    try {
        const allBooks = await Book.find()
        res.status(200).json({
            success: true,
            count: allBooks.length,
            allBooks
        })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const getBookById = async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findById(id);
        if (!book) {
            return res.status(404).json({ success: false, message: "Book not found" });
        }
        res.status(200).json({
            success: true,
            book
        })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const createBook = async (req, res) => {
    try {
        const { title, author, description, category, totalCopies, availableCopies, isbn } = req.body;

        const book = new Book({
            title,
            author,
            description,
            category,
            totalCopies,
            availableCopies,
            isbn,
            issuedCount: 0
        });

        await book.save();

        res.status(201).json({
            success: true,
            message: "Book created successfully",
            book
        })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const updateBookById = async (req, res) => {
    try {
        const { id } = req.params
        const { title, author, description, category, totalCopies, availableCopies, isbn } = req.body;

        const book = await Book.findByIdAndUpdate(id, {
            title,
            author,
            description,
            category,
            totalCopies,
            availableCopies,
            isbn
        }, { new: true });


        res.status(201).json({
            success: true,
            message: "Book created successfully",
            book
        })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const deleteBookById = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedBook = await Book.findByIdAndDelete(id);
        if (!deletedBook) {
            return res.status(404).json({ success: false, message: "Book not found" });
        }
        res.status(200).json({ success: true, message: "Book deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}