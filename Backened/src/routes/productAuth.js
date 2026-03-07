const express = require("express");
const ProductRouter = express.Router();
const {
    CreateProduct,
    UpdateProduct,
    DeleteProduct,
    GetOneProduct,
    GetAllProduct
} = require("../controllers/productverify");
const userMiddleware = require("../middlewares/usermiddleware");
const adminMiddleware = require("../middlewares/adminmiddleware");
const superMiddleware = require("../middlewares/superadminmiddleware");

ProductRouter.post("/createproduct",adminMiddleware,CreateProduct);
ProductRouter.put("/updateproduct",adminMiddleware,UpdateProduct);
ProductRouter.delete("/deleteproduct",adminMiddleware,DeleteProduct);
ProductRouter.get("/getoneproduct",userMiddleware,GetOneProduct);
ProductRouter.get("/getallproduct",userMiddleware,GetAllProduct);

module.exports = ProductRouter;