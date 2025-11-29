import { Reader } from "../models/Readers.js";

export const getAllReaders = async (req, res) => {
    try {
        const readers = await Reader.find({});
        res.status(200).json({ success: true, count: readers.length, readers });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
export const getReaderById = async (req, res) => {
    try {
        const { id } = req.params;
        const reader = await Reader.findById(id);
        res.status(200).json({ success: true, reader });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
export const createReader = async (req, res) => {
    try {
        const reader = new Reader(req.body);
        await reader.save();
        res.status(201).json({ success: true, message: "Reader created successfully", reader });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
export const updateReaderById = async (req, res) => {
    try {
        const { id } = req.params;
        const reader = await Reader.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json({ success: true, message: "Reader updated successfully", reader });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
export const deleteReaderById = async (req, res) => {
    try {
        const { id } = req.params;
        await Reader.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Reader deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
} 