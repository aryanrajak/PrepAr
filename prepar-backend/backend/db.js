const mongoose = require("mongoose");

async function connectDB() {
    console.log("Trying to connect MongoDB...");

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.log("MongoDB connection error:", error.message);
    }
}

module.exports = connectDB;
