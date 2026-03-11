const mongoose = require("mongoose");
const { Schema } = mongoose;

const adminRequestSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Person",
        required: true,
    },
    reason: {
        type: String,
        required: true,
        trim: true,
        minLength: 10,
        maxLength: 1000,
    },
    status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending",
    }
}, {
    timestamps: true,
});

// Ensure a user can only have one pending or approved request at a time
adminRequestSchema.index({ userId: 1, status: 1 });

const AdminRequest = mongoose.model("AdminRequest", adminRequestSchema);
module.exports = AdminRequest;
