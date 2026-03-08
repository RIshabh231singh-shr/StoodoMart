const express = require("express");
const ProductRouter = express.Router();
const {
    CreateProduct,
    UpdateProduct,
    DeleteProduct,
    GetOneProduct,
    GetAllProduct,
    GetMyProducts
} = require("../controllers/productverify");
const userMiddleware = require("../middlewares/usermiddleware");
const adminMiddleware = require("../middlewares/adminmiddleware");
const superMiddleware = require("../middlewares/superadminmiddleware");

ProductRouter.post("/createproduct",adminMiddleware,CreateProduct);
ProductRouter.put("/updateproduct/:id",adminMiddleware,UpdateProduct);
ProductRouter.delete("/deleteproduct/:id",adminMiddleware,DeleteProduct);
ProductRouter.get("/getoneproduct/:id",userMiddleware,GetOneProduct);
ProductRouter.get("/getallproduct",userMiddleware,GetAllProduct);
ProductRouter.get("/myproducts",adminMiddleware,GetMyProducts);

module.exports = ProductRouter;