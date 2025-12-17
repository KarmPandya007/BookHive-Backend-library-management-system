import mongoose from "mongoose";

const readerSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, },
        email: { type: String, required: true, trim: true, unique: true, },
        phone: { type: Number, default: "", unique: true, required: true, },
        address: { type: String, required: true, index: true, },
        id: { type: Number, required: true, unique: true, trim: true, },
        password: { type: String, required: true, },
    },
    {
        timestamps: true,
        // collection: "readers"
    }
);


export const Reader = mongoose.model("Reader", readerSchema);

