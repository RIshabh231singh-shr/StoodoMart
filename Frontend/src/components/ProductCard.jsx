import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../CartSlice";
import { Loader2, Package, ShoppingCart } from "lucide-react";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      alert("Please login to add items to the cart.");
      navigate("/login");
      return;
    }
    setIsAdding(true);
    try {
      await dispatch(addToCart({ productId: product._id, quantity: 1 })).unwrap();
    } catch (error) {
      alert(error || "Failed to add to cart");
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      alert("Please login to process your order.");
      navigate("/login");
      return;
    }
    
    setIsAdding(true);
    try {
      await dispatch(addToCart({ productId: product._id, quantity: 1 })).unwrap();
      navigate("/checkout");
    } catch (error) {
      alert(error || "Failed to initiate purchase");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col h-full hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              // Fallback for broken images
              e.target.src = "https://via.placeholder.com/400?text=No+Image";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            <Package size={48} />
          </div>
        )}

        {/* Out of Stock Overlay */}
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-slate-900 text-white font-bold px-4 py-2 rounded-full tracking-wide shadow-lg">
              Out of Stock
            </span>
          </div>
        )}

        {/* Category & Usage Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <span className="bg-white/90 backdrop-blur-sm text-[10px] font-black px-3 py-1.5 rounded-full text-slate-700 shadow-sm border border-white uppercase tracking-wider">
            {product.category}
          </span>
          <span className="bg-slate-900/80 backdrop-blur-sm text-[10px] font-bold px-3 py-1.5 rounded-full text-white shadow-sm border border-white/20 uppercase tracking-wider">
            Used: {product.usedFor}
          </span>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-bold text-lg text-slate-900 mb-1 line-clamp-2 leading-snug group-hover:text-brand-teal transition-colors">
          {product.name}
        </h3>

        <p className="text-slate-500 text-sm line-clamp-2 mb-4 flex-grow">
          {product.description}
        </p>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-black tracking-widest uppercase mb-0.5">Price</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-slate-900">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-slate-400 line-through decoration-slate-300">
                ₹{product.originalPrice?.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div className="flex gap-2 items-center">
            <button
              onClick={handleBuyNow}
              disabled={product.stock <= 0 || isAdding}
              className="px-4 py-2 bg-orange-400 text-slate-900 font-black rounded-xl text-sm hover:bg-orange-500 transition-all duration-300 disabled:opacity-50 shadow-sm hover:shadow-md h-10 flex items-center justify-center"
            >
              {isAdding ? <Loader2 size={18} className="animate-spin" /> : "Buy Now"}
            </button>
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0 || isAdding}
              className="h-10 w-10 rounded-xl bg-yellow-400 text-slate-900 flex items-center justify-center hover:bg-yellow-500 transition-colors disabled:opacity-50 shadow-md hover:shadow-lg disabled:shadow-none"
              title={product.stock > 0 ? "Add to Cart" : "Out of Stock"}
            >
              {isAdding ? <Loader2 size={18} className="animate-spin" /> : <ShoppingCart size={18} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
