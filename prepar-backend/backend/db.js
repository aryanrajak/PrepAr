const mongoose = require("mongoose");

async function connectDB() {
    console.log("Trying to connect MongoDB...");

    try {
        await mongoose.connect("mongodb+srv://allowwebsite420_db_user:EEIssjDqS2HY2wbY@cluster0.uxi97rt.mongodb.net/preparDB?retryWrites=true&w=majority&appName=Cluster0");
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.log("MongoDB connection error:", error.message);
    }
}

module.exports = connectDB;
