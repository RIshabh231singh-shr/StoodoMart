import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axiosClient from "../utility/axios";
import {
  MapPin, Package, Plus, Minus, Trash2,
  AlertCircle, CheckCircle, Loader2, ShoppingCart
} from "lucide-react";
import logo from "../assets/logo.png";

const checkoutSchema = z.object({
  address: z.string().min(5, "Please enter a valid delivery address (min 5 characters)"),
});

export default function PlaceOrder() {
  const navigate = useNavigate();

  // Cart: array of { product, quantity }
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts]   = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [apiError, setApiError]   = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { address: "" },
  });

  // Fetch available products to add to cart
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosClient.get("/product/getallproduct");
        setProducts(res.data.allproduct || []);
      } catch {
        // fail silently
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  // Add selected product to cart
  const handleAddToCart = () => {
    if (!selectedProduct) return;
    const product = products.find((p) => p._id === selectedProduct);
    if (!product) return;

    const existing = cartItems.find((c) => c.product._id === product._id);
    if (existing) {
      // Increase quantity if not exceeding stock
      if (existing.quantity >= product.stock) {
        alert(`Only ${product.stock} in stock for "${product.name}"`);
        return;
      }
      setCartItems((prev) =>
        prev.map((c) => c.product._id === product._id ? { ...c, quantity: c.quantity + 1 } : c)
      );
    } else {
      if (product.stock === 0) {
        alert(`"${product.name}" is out of stock`);
        return;
      }
      setCartItems((prev) => [...prev, { product, quantity: 1 }]);
    }
    setSelectedProduct("");
  };

  const handleQtyChange = (productId, delta) => {
    setCartItems((prev) =>
      prev
        .map((c) => {
          if (c.product._id !== productId) return c;
          const max = c.product.stock;
          const newQty = Math.min(max, Math.max(1, c.quantity + delta));
          return { ...c, quantity: newQty };
        })
    );
  };

  const handleRemove = (productId) => {
    setCartItems((prev) => prev.filter((c) => c.product._id !== productId));
  };

  const totalAmount = cartItems.reduce((sum, c) => sum + c.product.price * c.quantity, 0);

  const onSubmit = async (data) => {
    if (cartItems.length === 0) {
      setApiError("Please add at least one product to your order.");
      return;
    }

    setSubmitting(true);
    setApiError("");
    setSuccessMsg("");

    try {
      const payload = {
        address: data.address,
        products: cartItems.map((c) => ({
          productId: c.product._id,
          quantity: c.quantity,
        })),
      };

      await axiosClient.post("/order/createorder", payload);
      setSuccessMsg("Order placed successfully! Redirecting to your orders...");
      setCartItems([]);
      setTimeout(() => navigate("/my-orders"), 1500);
    } catch (err) {
      setApiError(err.response?.data?.message || "Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen font-sans flex flex-col bg-slate-800 bg-gradient-to-br from-indigo-500/40 via-purple-500/40 to-slate-800/40">
      {/* Navbar */}
      <nav className="relative z-20 px-8 py-5 border-b border-white/20 flex items-center justify-between bg-white/10 backdrop-blur-md">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="bg-white/10 p-2 rounded-xl group-hover:bg-white/20 transition-all">
            <img src={logo} alt="StoodoMart" className="w-8 h-auto" />
          </div>
          <h1 className="text-xl font-extrabold text-white tracking-tight">Stoodo<span className="text-purple-400">Mart</span></h1>
        </Link>
        <Link to="/my-orders" className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-xl transition-all border border-white/10">
          My Orders
        </Link>
      </nav>

      <main className="flex-grow flex justify-center items-start p-6 sm:p-10">
        <div className="w-full max-w-2xl">
          <h2 className="text-3xl font-extrabold text-white mb-1">Place an Order</h2>
          <p className="text-slate-300 mb-8 text-sm">Select products and enter your delivery address.</p>

          {apiError && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/50 text-red-200 text-sm flex items-center gap-3">
              <AlertCircle size={18} className="shrink-0" />{apiError}
            </div>
          )}
          {successMsg && (
            <div className="mb-6 p-4 rounded-xl bg-green-500/20 border border-green-500/50 text-green-200 text-sm flex items-center gap-3">
              <CheckCircle size={18} className="shrink-0" />{successMsg}
            </div>
          )}

          {/* Product picker */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-6 mb-5 shadow-xl">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Package size={18} /> Add Products</h3>
            <div className="flex gap-3">
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="flex-1 py-3 px-4 bg-white/10 border border-white/20 text-white text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 [&>option]:bg-slate-800 cursor-pointer"
                disabled={loadingProducts}
              >
                <option value="">{loadingProducts ? "Loading products..." : "Select a product..."}</option>
                {products.filter((p) => p.stock > 0).map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} — Rs. {p.price} ({p.stock} in stock)
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!selectedProduct}
                className="px-5 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold rounded-xl shadow-lg disabled:opacity-40 transition-all active:scale-95 hover:-translate-y-0.5 flex items-center gap-2"
              >
                <Plus size={18} /> Add
              </button>
            </div>
          </div>

          {/* Cart Items */}
          {cartItems.length > 0 && (
            <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-6 mb-5 shadow-xl">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2"><ShoppingCart size={18} /> Cart</h3>
              <div className="space-y-3">
                {cartItems.map(({ product, quantity }) => (
                  <div key={product._id} className="flex items-center gap-4 bg-white/5 rounded-xl p-3 border border-white/10">
                    {product.image && (
                      <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover shrink-0 border border-white/20" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-sm truncate">{product.name}</p>
                      <p className="text-slate-400 text-xs">Rs. {product.price} each</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleQtyChange(product._id, -1)} className="w-7 h-7 bg-white/10 hover:bg-white/20 text-white rounded-lg flex items-center justify-center transition-all active:scale-90">
                        <Minus size={14} />
                      </button>
                      <span className="text-white font-bold text-sm w-6 text-center">{quantity}</span>
                      <button onClick={() => handleQtyChange(product._id, 1)} className="w-7 h-7 bg-white/10 hover:bg-white/20 text-white rounded-lg flex items-center justify-center transition-all active:scale-90">
                        <Plus size={14} />
                      </button>
                    </div>
                    <p className="text-indigo-300 font-bold text-sm w-20 text-right">Rs. {(product.price * quantity).toLocaleString()}</p>
                    <button onClick={() => handleRemove(product._id)} className="text-red-400 hover:text-red-300 transition-colors p-1">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                <span className="text-slate-300 font-bold">Total</span>
                <span className="text-white font-extrabold text-xl">Rs. {totalAmount.toLocaleString()}</span>
              </div>
            </div>
          )}

          {/* Checkout Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-6 mb-5 shadow-xl">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2"><MapPin size={18} /> Delivery Address</h3>
              <div className="relative">
                <MapPin className="absolute left-4 top-4 text-slate-400 w-5 h-5 pointer-events-none" />
                <textarea
                  {...register("address")}
                  rows={3}
                  className={`w-full pl-11 pr-4 py-3 bg-white/10 border ${errors.address ? "border-red-400" : "border-white/20"} rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all resize-none`}
                  placeholder="Enter your full delivery address..."
                />
              </div>
              {errors.address && <p className="text-red-400 text-xs mt-1 ml-1 font-medium">{errors.address.message}</p>}
            </div>

            <button
              type="submit"
              disabled={submitting || cartItems.length === 0}
              className="w-full py-4 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-extrabold rounded-2xl shadow-[0_10px_25px_rgba(99,102,241,0.3)] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-base"
            >
              {submitting ? (
                <><Loader2 size={20} className="animate-spin" /> Placing Order...</>
              ) : (
                <><ShoppingCart size={20} /> Place Order — Rs. {totalAmount.toLocaleString()}</>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
