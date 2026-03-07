const express = require("express");
const AuthRouter = express.Router();

const {
    register , updateprofile , deleteprofile , login , getOneProfile , getAllProfile , logout
} = require("../controllers/personverify");

const AdminMiddleware = require("../middlewares/adminmiddleware");
const userMiddleware = require("../middlewares/usermiddleware");
const SuperMiddleware = require("../middlewares/superadminmiddleware");

AuthRouter.post("/register", register);
AuthRouter.post("/login", login);
AuthRouter.post("/logout", userMiddleware, logout);


AuthRouter.put("/updateprofile",userMiddleware,updateprofile);
AuthRouter.put("/superupdateprofile",SuperMiddleware,updateprofile);

AuthRouter.delete("/deleteprofile",userMiddleware,deleteprofile);
AuthRouter.delete("/superdeleteprofile",SuperMiddleware,deleteprofile);

AuthRouter.get("/getOneProfile",userMiddleware,getOneProfile);
AuthRouter.get("/supergetOneProfile",SuperMiddleware,getOneProfile);

AuthRouter.get("/supergetAllProfile",SuperMiddleware,getAllProfile);

module.exports = AuthRouter;