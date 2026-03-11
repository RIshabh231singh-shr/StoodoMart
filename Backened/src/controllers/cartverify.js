const Cart = require("../models/cart");

const getCart = async (req, res) => {
    try {
        const userId = req.user._id;
        let cart = await Cart.findOne({ userId }).populate("products.productId");
        
        if (!cart) {
            return res.status(200).json({ cart: { products: [] }, message: "Cart is empty" });
        }
        res.status(200).json({ cart, message: "Cart fetched successfully" });
    } catch (error) {
        console.error("Error fetching cart:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

const addToCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId, quantity } = req.body;

        if (!productId || quantity < 1) {
            return res.status(400).json({ message: "Invalid product or quantity" });
        }

        let cart = await Cart.findOne({ userId });

        if (cart) {
            // Check if product already exists in cart
            const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);

            if (productIndex > -1) {
                // Product exists, update quantity
                cart.products[productIndex].quantity += quantity;
            } else {
                // Product does not exist in cart, add new item
                cart.products.push({ productId, quantity });
            }
            await cart.save();
        } else {
            // No cart exists for user, create one
            cart = await Cart.create({
                userId,
                products: [{ productId, quantity }]
            });
        }

        // Return populated cart
        const populatedCart = await Cart.findById(cart._id).populate("products.productId");
        res.status(200).json({ cart: populatedCart, message: "Added to cart successfully" });

    } catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

const removeFromCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({ message: "Product ID is required" });
        }

        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        cart.products = cart.products.filter(p => p.productId.toString() !== productId);
        await cart.save();

        const populatedCart = await Cart.findById(cart._id).populate("products.productId");
        res.status(200).json({ cart: populatedCart, message: "Removed from cart successfully" });

    } catch (error) {
        console.error("Error removing from cart:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

const updateQuantity = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId, quantity } = req.body;

        if (!productId || quantity < 1) {
            return res.status(400).json({ message: "Invalid product or quantity" });
        }

        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);

        if (productIndex > -1) {
            cart.products[productIndex].quantity = quantity;
            await cart.save();
            const populatedCart = await Cart.findById(cart._id).populate("products.productId");
            res.status(200).json({ cart: populatedCart, message: "Quantity updated successfully" });
        } else {
            return res.status(404).json({ message: "Product not found in cart" });
        }

    } catch (error) {
        console.error("Error updating cart quantity:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

module.exports = {
    getCart,
    addToCart,
    removeFromCart,
    updateQuantity
};
