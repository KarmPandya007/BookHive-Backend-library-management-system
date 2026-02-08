import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true, unique: true, },

        author: { type: String, required: true, trim: true, },

        description: { type: String, default: "", },

        category: { type: String, required: true, index: true, },

        isbn: { type: String, required: true, unique: true, trim: true, },

        coverImage: { type: String, default: "" }, // Cloudinary URL

        totalCopies: { type: Number, required: true, min: 1, },

        availableCopies: { type: Number, required: true, min: 0, },

        issuedCount: { type: Number, default: 0, },

        // Optional: keywords for better search
        // keywords: {type: [String],default: [],}
    },
    {
        timestamps: true,
    }
);

// 🔍 Text index for search (very useful in libraries)
bookSchema.index({ title: "text", author: "text", category: "text" });

export const Book = mongoose.model("Book", bookSchema);

