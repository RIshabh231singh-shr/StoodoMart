const AdminRequest = require("../models/adminRequest");
const Person = require("../models/person");

const createAdminRequest = async (req, res) => {
    try {
        const userId = req.user._id;
        const { reason } = req.body;

        if (!reason || reason.trim().length < 10) {
            return res.status(400).json({ message: "Please provide a valid reason (at least 10 characters)." });
        }

        // Check if user is already an Admin or SuperAdmin
        if (req.user.role === "Admin" || req.user.role === "SuperAdmin") {
            return res.status(400).json({ message: "You are already an Admin." });
        }

        // Check if there's already a pending request
        const existingRequest = await AdminRequest.findOne({ 
            userId, 
            status: "Pending" 
        });

        if (existingRequest) {
            return res.status(400).json({ message: "You already have a pending action request." });
        }

        const newRequest = await AdminRequest.create({
            userId,
            reason
        });

        res.status(201).json({ message: "Request submitted successfully. Waiting for SuperAdmin approval.", request: newRequest });
    } catch (error) {
        console.error("Error creating admin request:", error);
        res.status(500).json({ message: error.message });
    }
};

const getAllAdminRequests = async (req, res) => {
    try {
        let { page, status } = req.query;
        page = parseInt(page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        const query = {};
        if (status && ["Pending", "Approved", "Rejected"].includes(status)) {
            query.status = status;
        }

        const requests = await AdminRequest.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("userId", "firstname lastname email role"); // Bring in user details

        const totalRequests = await AdminRequest.countDocuments(query);
        const totalPages = Math.ceil(totalRequests / limit);

        res.status(200).json({
            message: "Requests fetched successfully",
            requests,
            totalPages,
            currentPage: page,
            totalRequests
        });
    } catch (error) {
        console.error("Error fetching admin requests:", error);
        res.status(500).json({ message: error.message });
    }
};

const updateAdminRequestStatus = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { status } = req.body;

        if (!["Approved", "Rejected"].includes(status)) {
            return res.status(400).json({ message: "Invalid status update. Must be Approved or Rejected." });
        }

        const request = await AdminRequest.findById(requestId);
        if (!request) {
            return res.status(404).json({ message: "Request not found." });
        }

        if (request.status !== "Pending") {
            return res.status(400).json({ message: `This request has already been ${request.status.toLowerCase()}.` });
        }

        request.status = status;
        await request.save();

        // If approved, update the User's role to Admin
        if (status === "Approved") {
            await Person.findByIdAndUpdate(request.userId, { role: "Admin" });
        }

        res.status(200).json({ message: `Request successfully marked as ${status}.`, request });
    } catch (error) {
        console.error("Error updating admin request status:", error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createAdminRequest,
    getAllAdminRequests,
    updateAdminRequestStatus
};
