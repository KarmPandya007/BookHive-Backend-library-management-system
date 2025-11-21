import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const MONGO_URI = process.env.MONGO_URI

        await mongoose.connect(MONGO_URI).then(() => {
            console.log("Database connected")
        })
    }catch(error){
        console.log("Error connecting DB : ", error.message)
    }
}