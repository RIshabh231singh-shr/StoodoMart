const Newsletter = require("../models/newsletter");

const subscribe = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email || !email.trim()) {
            return res.status(400).json({ message: "Email is required." });
        }

        // Check if already subscribed
        const existing = await Newsletter.findOne({ email: email.toLowerCase().trim() });
        if (existing) {
            return res.status(409).json({ message: "This email is already subscribed!" });
        }

        await Newsletter.create({ email: email.toLowerCase().trim() });
        res.status(201).json({ message: "You're subscribed! Thank you for joining StoodoMart 🎉" });
    } catch (error) {
        console.error("Newsletter subscription error:", error);
        res.status(500).json({ message: "Something went wrong. Please try again." });
    }
};

module.exports = { subscribe };
