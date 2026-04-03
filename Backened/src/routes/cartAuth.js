const express = require("express");
const CartRouter = express.Router();

const {
    getCart,
    addToCart,
    removeFromCart,
    updateQuantity
} = require("../controllers/cartverify");

const userMiddleware = require("../middlewares/usermiddleware");

// All cart routes require authentication
CartRouter.use(userMiddleware);

CartRouter.get("/", getCart);
CartRouter.post("/add", addToCart);
CartRouter.post("/remove", removeFromCart);
CartRouter.put("/update", updateQuantity);

module.exports = CartRouter;
