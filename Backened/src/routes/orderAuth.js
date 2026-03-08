const express = require("express");
const OrderRouter = express.Router();

const {
    CreateOrder,
    UpdateOrder,
    DeleteOrder,
    GetOneOrder,
    GetAllOrders,
    GetMyOrders
} = require("../controllers/orderverify");

const userMiddleware  = require("../middlewares/usermiddleware");
const adminMiddleware = require("../middlewares/adminmiddleware");

// Any logged-in user can place and view their own orders
OrderRouter.post("/createorder",       userMiddleware,  CreateOrder);
OrderRouter.get("/myorders",           userMiddleware,  GetMyOrders);
OrderRouter.get("/getoneorder/:id",    userMiddleware,  GetOneOrder);

// Admin / SuperAdmin only
OrderRouter.put("/updateorder/:id",    adminMiddleware, UpdateOrder);
OrderRouter.delete("/deleteorder/:id", adminMiddleware, DeleteOrder);
OrderRouter.get("/getallorders",       adminMiddleware, GetAllOrders);

module.exports = OrderRouter;
