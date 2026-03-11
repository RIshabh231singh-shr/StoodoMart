import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../CartSlice";
import { Loader2, Package, ShoppingCart } from "lucide-react";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      alert("Please login to add items to the cart.");
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

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-white/90 backdrop-blur-sm text-xs font-bold px-3 py-1.5 rounded-full text-slate-700 shadow-sm border border-white">
            {product.category}
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
            <span className="text-xs text-slate-400 font-medium tracking-wide uppercase">Price</span>
            <span className="text-xl font-black text-slate-900">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0 || isAdding}
            className="h-10 w-10 rounded-xl bg-slate-900 text-white flex items-center justify-center hover:bg-brand-teal transition-colors disabled:opacity-50 disabled:hover:bg-slate-900 shadow-md hover:shadow-lg disabled:shadow-none"
            title={product.stock > 0 ? "Add to Cart" : "Out of Stock"}
          >
            {isAdding ? <Loader2 size={18} className="animate-spin" /> : <ShoppingCart size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
}
