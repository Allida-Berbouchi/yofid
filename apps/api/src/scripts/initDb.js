import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const MONGO_URI = process.env.MONGO_URI || "mongodb://admin:admin@localhost:27017/Yovid?authSource=admin";
async function initializeDatabase() {
    try {
        console.log("🔗 Connecting to MongoDB...");
        await mongoose.connect(MONGO_URI);
        console.log("✅ Connected to MongoDB");
        const db = mongoose.connection.db;
        // Create Users collection
        console.log("📝Creating Users collection...");
        try {
            await db?.createCollection("users");
            console.log("✅ Users collection created");
        }
        catch (error) {
            if (error.codeName !== "NamespaceExists") {
                throw error;
            }
            console.log("ℹ️  Users collection already exists");
        }
        // Resources collection
        console.log("📝 Creating Resources collection...");
        try {
            await db?.createCollection("resources");
            console.log("✅ Resources collection created");
        }
        catch (error) {
            if (error.codeName !== "NamespaceExists") {
                throw error;
            }
            console.log("ℹ️  Resources collection already exists");
        }
        // Create ContentRequests collection
        console.log("📝 Creating ContentRequests collection...");
        try {
            await db?.createCollection("contentrequests");
            console.log("✅ ContentRequests collection created");
        }
        catch (error) {
            if (error.codeName !== "NamespaceExists") {
                throw error;
            }
            console.log("ℹ️  ContentRequests collection already exists");
        }
        // Create indexes for Users
        console.log("📌 Creating Users indexes...");
        await db?.collection("users").createIndex({ email: 1 }, { unique: true });
        await db?.collection("users").createIndex({ createdAt: 1 });
        console.log("✅ Users indexes created");
        // Create indexes for Resources
        console.log("📌 Creating Resources indexes...");
        await db?.collection("resources").createIndex({ title: "text", description: "text", tags: "text", skills: "text" });
        await db?.collection("resources").createIndex({ moduleId: 1 });
        await db?.collection("resources").createIndex({ createdBy: 1 });
        await db?.collection("resources").createIndex({ status: 1 });
        await db?.collection("resources").createIndex({ tags: 1 });
        await db?.collection("resources").createIndex({ skills: 1 });
        console.log("✅ Resources indexes created");
        // Create indexes for ContentRequests
        console.log("📌 Creating ContentRequests indexes...");
        await db?.collection("contentrequests").createIndex({ email: 1 });
        await db?.collection("contentrequests").createIndex({ createdAt: 1 });
        console.log("✅ ContentRequests indexes created");
        console.log("\n🎉 Database initialization complete!");
        console.log("Database: Yovid");
        console.log("Collections: users, resources, contentrequests");
        await mongoose.disconnect();
        console.log("✅ Disconnected from MongoDB");
    }
    catch (error) {
        console.error("❌ Error during database initialization:", error);
        process.exit(1);
    }
}
initializeDatabase();
