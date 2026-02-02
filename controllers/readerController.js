import { Reader } from "../models/Readers.js";

export const getAllReaders = async (req, res) => {
    try {
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
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
export const getReaderById = async (req, res) => {
    try {
        const { id } = req.params;
        const reader = await Reader.findById(id).lean();
        if (!reader) {
            return res.status(404).json({ success: false, message: "Reader not found" });
        }
        res.status(200).json({ success: true, reader });
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

export const deleteAllReaders = async (req, res) => {
    try {
        const result = await Reader.deleteMany({});
        if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, message: "No readers found to delete." });
        }
        res.status(200).json({ success: true, message: "All readers deleted successfully." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const registerReader = async (req, res) => {
    try {
        const { name, email, phone, address, id, password } = req.body;
        const reader = await Reader.findOne({
            $or: [{ email: email }, { phone: phone }, { id: id }]
        }).select('_id').lean();
        if (reader) {
            return res.status(400).json({ success: false, message: "Reader with this email, phone, or ID already exists." });
        }

        const newReader = new Reader({ name, email, phone, address, id, password });
        await newReader.save();
        res.status(201).json({ success: true, message: "Reader successfully registered.", reader: newReader });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}