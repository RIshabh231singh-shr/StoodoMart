const mongoose = require("mongoose");

const bcrypt = require("bcrypt");

const personSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 100,
    },
    lastname: {
        type: String,
        trim: true,
        minLength: 3,
        maxLength: 100,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Please fill a valid email address"]
    },
    contactNumber: {
        type: String,
        required: true,
        trim: true,
        match: [/^\+91\d{10}$/, "Please fill a valid contact number"]
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
    },
    role: {
        type: String,
        enum: ["User", "Admin", "SuperAdmin"],
        default: "User",
    },
    avatar: {
        type: String,
        default: null,
    },
    college: {
        type: String,
        trim: true,
        default: null,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    otp: String,
    otpExpiry: Date
}, { timestamps: true });


personSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}

const Person = mongoose.model("Person", personSchema);
module.exports = Person;
