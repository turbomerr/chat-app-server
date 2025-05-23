import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: '../.env' })

export const connectMongoDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log("Connected to MongoDB");
        //console.log(process.env.MONGO_DB_URI)
    } catch (error) {
        console.log("Error connecting Mongo DB",error.message);
    }
}