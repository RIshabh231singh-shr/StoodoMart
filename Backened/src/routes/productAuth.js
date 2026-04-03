const express = require("express");
const ProductRouter = express.Router();
const {
    CreateProduct,
    UpdateProduct,
    DeleteProduct,
    GetOneProduct,
    GetAllProduct,
    GetMyProducts,
    GetProductsByCategory
} = require("../controllers/productverify");
const userMiddleware = require("../middlewares/usermiddleware");
const adminMiddleware = require("../middlewares/adminmiddleware");
const superMiddleware = require("../middlewares/superadminmiddleware");
const upload = require("../middlewares/uploadMiddleware");

ProductRouter.post("/createproduct", adminMiddleware, upload.single("image"), CreateProduct);
ProductRouter.put("/updateproduct/:id",adminMiddleware,UpdateProduct);
ProductRouter.delete("/deleteproduct/:id",adminMiddleware,DeleteProduct);
ProductRouter.get("/getoneproduct/:id", GetOneProduct); // Made public
ProductRouter.get("/getallproduct", GetAllProduct); // Made public so unauth users can view Shop
ProductRouter.get("/myproducts",adminMiddleware,GetMyProducts);
ProductRouter.get("/category/:slug", GetProductsByCategory); // Open to public/all users

module.exports = ProductRouter;