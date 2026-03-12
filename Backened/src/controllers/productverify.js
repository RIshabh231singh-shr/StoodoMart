const Product = require("../models/product");
const cloudinary = require("../config/cloudinary");

// Helper to upload a buffer to Cloudinary
const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: "stoodomart/products", resource_type: "image" },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        stream.end(buffer);
    });
};

const CreateProduct = async (req, res) => {
    try {
        const { name, price, description, category, stock, college, usedFor, originalPrice } = req.body;

        if (!name || !price || !description || !category || !stock || !college || !usedFor || !originalPrice) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (!req.file) {
            return res.status(400).json({ message: "Product image is required" });
        }
        if (price < 0) {
            return res.status(400).json({ message: "Price cannot be negative" });
        }
        if (stock < 0) {
            return res.status(400).json({ message: "Stock cannot be negative" });
        }

        // Upload image to Cloudinary
        const uploadResult = await uploadToCloudinary(req.file.buffer);
        const imageUrl = uploadResult.secure_url;

        const product = await Product.create({
            name,
            price,
            description,
            category,
            stock,
            college,
            usedFor,
            originalPrice,
            image: imageUrl,
            createdBy: req.user._id,
        });

        res.status(201).json({ message: "Product created successfully", product });
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ message: error.message });
    }
}

const UpdateProduct = async (req,res)=>{
    try{
        const {id} = req.params;
        const {name,price,description,image,category,stock, usedFor, originalPrice} = req.body;
        if(!name || !price || !description || !image || !category || !stock || !usedFor || !originalPrice){
            return res.status(400).json({ message: "All fields are required" });
        }
        if(price < 0){
            return res.status(400).json({ message: "Price cannot be negative" });
        }
        if(stock < 0){
            return res.status(400).json({ message: "Stock cannot be negative" });
        }
        const product = await Product.findByIdAndUpdate(id,req.body,{
            new:true,
            runValidators: true
        });
        res.status(200).json({ message: "Product updated successfully", product });
    }
    catch(err){
        console.error("Error updating product:", err);
        res.status(500).json({ message: err.message });
    }
}

const DeleteProduct = async (req,res)=>{
    try{
        const {id} = req.params;
        if(!id){
            return res.status(400).json({ message: "Product ID is required" });
        }
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ message: "Product deleted successfully", product });
    }
    catch(err){
        console.error("Error deleting product:", err);
        res.status(500).json({ message: err.message });
    }
}

const GetOneProduct = async (req,res)=>{
    try{
        const { id } = req.params;
        const product = await Product.findById(id);
        if(!product){
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ message: "Product found successfully", product });
    }
    catch(error){
        console.error("Error finding product:", error);
        res.status(500).json({ message: error.message });
    }
}

const GetAllProduct = async (req,res)=>{
    try{
        let {page, college, minPrice, maxPrice, sort} = req.query;
        page = parseInt(page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        // Build search query
        const query = {};
        if (college) {
            query.college = college;
        }

        // Price Filtering
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        // Sorting
        let sortOption = { createdAt: -1 }; // Default: Newest
        if (sort === "price_asc") sortOption = { price: 1 };
        else if (sort === "price_desc") sortOption = { price: -1 };
        else if (sort === "newest") sortOption = { createdAt: -1 };

        const allproduct = await Product.find(query)
            .sort(sortOption)
            .skip(skip)
            .limit(limit);
            
        const totalProducts = await Product.countDocuments(query);
        const totalPages = Math.ceil(totalProducts / limit);

        res.status(200).json({ 
            message: "All products found successfully", 
            allproduct,
            totalPages,
            currentPage: page
        });
    }
    catch(error){
        console.error("Error finding products:", error);
        res.status(500).json({ message: error.message });
    }
}

const GetMyProducts = async (req, res) => {
    try {
        let { page } = req.query;
        page = parseInt(page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        const userId = req.user._id;

        const myProducts = await Product.find({ createdBy: userId })
            .skip(skip)
            .limit(limit)
            .populate("createdBy", "firstname lastname email role"); // Optional: populate user details
        
        const totalProducts = await Product.countDocuments({ createdBy: userId });
        const totalPages = Math.ceil(totalProducts / limit);

        res.status(200).json({ 
            message: "Products fetched successfully", 
            products: myProducts,
            totalPages,
            currentPage: page,
            totalProducts
        });
    } catch (error) {
        console.error("Error finding user's products:", error);
        res.status(500).json({ message: error.message });
    }
}

const GetProductsByCategory = async (req, res) => {
    try {
        const { slug } = req.params;
        let { page, college, minPrice, maxPrice, sort } = req.query;
        
        page = parseInt(page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        const decodedSlug = decodeURIComponent(slug).toLowerCase();
        let mappedCategories = [];
        let categoryName = decodedSlug;

        // Map the frontend slugs directly to the allowed Product schema enums
        if (decodedSlug === 'electronics-and-instruments') {
            mappedCategories = ['Electronics', 'Instrument'];
            categoryName = "Electronics And Instruments";
        } else if (decodedSlug === 'stationary-and-clothing') {
            mappedCategories = ['Stationary', 'Other'];
            categoryName = "Stationary And Clothing";
        } else if (decodedSlug === 'sports & fitness' || decodedSlug === 'sports-and-fitness') {
            mappedCategories = ['Other'];
            categoryName = "Sports & Fitness";
        } else if (decodedSlug === 'hostel essentials' || decodedSlug === 'hostel-essentials') {
            mappedCategories = ['Other'];
            categoryName = "Hostel Essentials";
        } else {
            const fallbackMap = {
                'electronics': 'Electronics',
                'instrument': 'Instrument',
                'stationary': 'Stationary',
                'other': 'Other'
            };
            mappedCategories = [fallbackMap[decodedSlug] || "Other"];
            categoryName = mappedCategories[0];
        }

        const query = { category: { $in: mappedCategories } };
        
        if (college) {
            query.college = college;
        }

        // Price Filtering
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        // Sorting
        let sortOption = { createdAt: -1 };
        if (sort === "price_asc") sortOption = { price: 1 };
        else if (sort === "price_desc") sortOption = { price: -1 };
        else if (sort === "newest") sortOption = { createdAt: -1 };

        const products = await Product.find(query)
            .sort(sortOption)
            .skip(skip)
            .limit(limit);

        const totalProducts = await Product.countDocuments(query);
        const totalPages = Math.ceil(totalProducts / limit);

        res.status(200).json({
            message: "Category products found successfully",
            products,
            totalPages,
            currentPage: page,
            totalProducts,
            category: categoryName
        });
    } catch (error) {
        console.error("Error finding products by category:", error);
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    CreateProduct,
    UpdateProduct,
    DeleteProduct,
    GetOneProduct,
    GetAllProduct,
    GetMyProducts,
    GetProductsByCategory
};