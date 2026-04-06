const express = require("express");
const AuthRouter = express.Router();

const {
    register, updateprofile, deleteprofile, login, getOneProfile, getAllProfile, logout, verifyAuth, promoteToAdmin, verifyOtp, changeCurrentPassword, forgotPassword, resetPassword
} = require("../controllers/personverify");

const AdminMiddleware = require("../middlewares/adminmiddleware");
const userMiddleware = require("../middlewares/usermiddleware");
const SuperMiddleware = require("../middlewares/superadminmiddleware");
const upload = require("../middlewares/uploadMiddleware");

AuthRouter.post("/register", register);
AuthRouter.post("/login", login);
AuthRouter.post("/logout", userMiddleware, logout);
// AuthRouter.patch("/change-password", userMiddleware, changeCurrentPassword);

AuthRouter.put("/updateprofile/:id", userMiddleware, upload.single("avatar"), updateprofile);

AuthRouter.delete("/deleteprofile/:id", userMiddleware, deleteprofile);
AuthRouter.delete("/superdeleteprofile/:id", SuperMiddleware, deleteprofile);

AuthRouter.get("/getOneProfile/:id", userMiddleware, getOneProfile);
AuthRouter.get("/supergetOneProfile/:id", SuperMiddleware, getOneProfile);

AuthRouter.get("/supergetAllProfile", SuperMiddleware, getAllProfile);

AuthRouter.get("/verify", userMiddleware, verifyAuth);
AuthRouter.post("/promote", userMiddleware, promoteToAdmin);
AuthRouter.post("/verify-otp", verifyOtp);
AuthRouter.patch("/change-password", userMiddleware, changeCurrentPassword);
AuthRouter.post("/forgot-password", forgotPassword);
AuthRouter.post("/reset-password", resetPassword);

module.exports = AuthRouter;