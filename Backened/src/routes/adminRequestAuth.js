const express = require("express");
const AdminRequestRouter = express.Router();
const {
    createAdminRequest,
    getAllAdminRequests,
    updateAdminRequestStatus,
    getMyRequestStatus
} = require("../controllers/adminRequestVerify");

const userMiddleware = require("../middlewares/usermiddleware");
const superAdminMiddleware = require("../middlewares/superadminmiddleware");

// Standard users can create requests
AdminRequestRouter.post("/create", userMiddleware, createAdminRequest);
AdminRequestRouter.get("/my-status", userMiddleware, getMyRequestStatus);

// Only SuperAdmins can view and approve requests
AdminRequestRouter.get("/admin", superAdminMiddleware, getAllAdminRequests);
AdminRequestRouter.put("/admin/:requestId/status", superAdminMiddleware, updateAdminRequestStatus);

module.exports = AdminRequestRouter;
