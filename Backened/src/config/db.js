const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        // Yeh nayi line add kijiye check karne ke liye
        console.log("Check - Mera DB URL yeh hai:", process.env.DB_URL);

        await mongoose.connect(process.env.DB_URL);
        console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB connection error:", error.message); // error.message se output clean aayega
    }
};

module.exports = connectDB;