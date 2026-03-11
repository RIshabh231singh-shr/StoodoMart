const Order = require("../models/order");
const Product = require("../models/product");

// ─── Create Order ──────────────────────────────────────────────────────────────
const CreateOrder = async (req, res) => {
    try {
        const userId = req.user._id;
        const { address, products } = req.body;

        if (!address || !products || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: "Address and a non-empty products list are required" });
        }

        let orderProducts = [];
        let totalAmount = 0;

        // Validate all items before creating anything
        for (const item of products) {
            const product = await Product.findById(item.productId);

            if (!product) {
                return res.status(404).json({ message: `Product with ID ${item.productId} not found` });
            }
            if (item.quantity <= 0) {
                return res.status(400).json({ message: `Quantity for product ${product.name} must be greater than zero` });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for ${product.name}. Available: ${product.stock}` });
            }

            orderProducts.push({
                productId: product._id,
                quantity: item.quantity,
                price: product.price
            });
            totalAmount += product.price * item.quantity;
        }

        // Create the order
        const order = await Order.create({ userId, address, products: orderProducts, totalAmount });

        // Decrement stock for each product
        for (const item of orderProducts) {
            await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } });
        }

        res.status(201).json({ message: "Order created successfully", order });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ message: error.message || "Internal Server Error" });
    }
};

// ─── Update Order Status ───────────────────────────────────────────────────────
// Only Admin / SuperAdmin can update order status
const UpdateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Order ID is required" });
        }

        const { status } = req.body;
        const allowedStatuses = ["Pending", "Completed", "Cancelled"];
        if (!status || !allowedStatuses.includes(status)) {
            return res.status(400).json({ message: `Status must be one of: ${allowedStatuses.join(", ")}` });
        }

        const order = await Order.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({ message: "Order updated successfully", order });
    } catch (error) {
        console.error("Error updating order:", error);
        res.status(500).json({ message: error.message || "Internal Server Error" });
    }
};

// ─── Delete Order ──────────────────────────────────────────────────────────────
// Only Admin / SuperAdmin can delete any order
const DeleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Order ID is required" });
        }

        const order = await Order.findByIdAndDelete(id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({ message: "Order deleted successfully", order });
    } catch (error) {
        console.error("Error deleting order:", error);
        res.status(500).json({ message: error.message || "Internal Server Error" });
    }
};

// ─── Get One Order ─────────────────────────────────────────────────────────────
// Any logged-in user can fetch a single order, but only their own
// Admins/SuperAdmins can fetch any order
const GetOneOrder = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Order ID is required" });
        }

        const order = await Order.findById(id)
            .populate("userId", "firstname lastname email")
            .populate("products.productId", "name image price");

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Users can only view their own orders
        const loggedInRole = req.user.role;
        const loggedInId = req.user._id.toString();
        if (loggedInRole === "User" && order.userId._id.toString() !== loggedInId) {
            return res.status(403).json({ message: "You are not allowed to view this order" });
        }

        res.status(200).json({ message: "Order fetched successfully", order });
    } catch (error) {
        console.error("Error fetching order:", error);
        res.status(500).json({ message: error.message || "Internal Server Error" });
    }
};

// ─── Get All Orders (Admin / SuperAdmin) ───────────────────────────────────────
const GetAllOrders = async (req, res) => {
    try {
        let { page, limit, status } = req.query;
        page  = parseInt(page)  || 1;
        limit = parseInt(limit) || 10;
        const skip = (page - 1) * limit;

        const query = {};
        if (status) query.status = status;

        const orders = await Order.find(query)
            .skip(skip)
            .limit(limit)
            .populate("userId", "firstname lastname email")
            .populate("products.productId", "name image price")
            .sort({ createdAt: -1 });  // newest first

        const totalOrders = await Order.countDocuments(query);
        const totalPages  = Math.ceil(totalOrders / limit);

        res.status(200).json({
            message: "All orders fetched successfully",
            orders,
            currentPage: page,
            totalPages,
            totalOrders
        });
    } catch (error) {
        console.error("Error fetching all orders:", error);
        res.status(500).json({ message: error.message || "Internal Server Error" });
    }
};

// ─── Get My Orders (Logged-in User) ───────────────────────────────────────────
const GetMyOrders = async (req, res) => {
    try {
        let { page, limit } = req.query;
        page  = parseInt(page)  || 1;
        limit = parseInt(limit) || 10;
        const skip = (page - 1) * limit;

        const userId = req.user._id;

        const orders = await Order.find({ userId })
            .skip(skip)
            .limit(limit)
            .populate("products.productId", "name image price")
            .sort({ createdAt: -1 });  // newest first

        const totalOrders = await Order.countDocuments({ userId });
        const totalPages  = Math.ceil(totalOrders / limit);

        res.status(200).json({
            message: "My orders fetched successfully",
            orders,
            currentPage: page,
            totalPages,
            totalOrders
        });
    } catch (error) {
        console.error("Error fetching user's orders:", error);
        res.status(500).json({ message: error.message || "Internal Server Error" });
    }
};

module.exports = {
    CreateOrder,
    UpdateOrder,
    DeleteOrder,
    GetOneOrder,
    GetAllOrders,
    GetMyOrders
};
