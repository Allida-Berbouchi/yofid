import mongoose from "mongoose";
import { env } from "./env.js";
export let isDBConnected = false;
export async function connectDB() {
    mongoose.set("strictQuery", true);
    await mongoose.connect(env.MONGO_URI);
    console.log("MongoDB connected");
    isDBConnected = true;
}
