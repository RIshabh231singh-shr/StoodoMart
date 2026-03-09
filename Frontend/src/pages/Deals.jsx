import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router";
import axiosClient from "../utility/axios";
import { Search, Package, ShoppingCart, Tag, Zap } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

// Utility to generate a consistent "random" discount based on product ID
const getDiscountForProduct = (idStr) => {
  if (!idStr) return 0;
  const lastChar = idStr.charCodeAt(idStr.length - 1);
  if (lastChar % 5 === 0) return 40; 
  if (lastChar % 3 === 0) return 30; 
  if (lastChar % 2 === 0) return 20; 
  return 15; 
};

export default function Deals() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axiosClient.get("/product/getallproduct", {
        params: { page: 1, limit: 50 },
      });
      
      const allFetched = res.data.allproduct || [];
      const inStock = allFetched.filter(p => p.stock > 0);
      setProducts(inStock.slice(0, 12));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load deals. Please check your connection.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredDeals = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen font-sans flex flex-col bg-slate-50 text-slate-900">
      <Header />
      
      <main className="flex-grow pt-32 pb-16">
        
        {/* Deals Hero Banner */}
        <div className="container mx-auto px-4 md:px-8 max-w-7xl mb-12">
          <div className="bg-gradient-to-r from-brand-red via-brand-orange to-amber-500 rounded-3xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-48 h-48 bg-black/10 rounded-full blur-2xl"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-sm font-bold uppercase tracking-wider mb-4">
                  <span className="animate-pulse">🔥</span> Limited Time Offers
                </div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 drop-shadow-md">
                  Exclusive Student Deals
                </h1>
                <p className="text-white/90 text-lg md:text-xl font-medium">
                  Up to 40% off on premium essentials. Verify your student ID to claim these discounts before they're gone!
                </p>
              </div>
              
              <div className="hidden md:flex flex-col items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center transform rotate-3 shadow-2xl">
                <span className="text-sm font-bold uppercase tracking-widest text-white/80 mb-1">Ends In</span>
                <div className="flex gap-3 text-3xl font-black font-mono">
                  <div className="flex flex-col"><span className="bg-white text-brand-red rounded-lg px-3 py-2 shadow-inner">12</span><span className="text-[10px] text-white/80 mt-1 uppercase">Hours</span></div>
                  <span className="py-2 animate-pulse">:</span>
                  <div className="flex flex-col"><span className="bg-white text-brand-red rounded-lg px-3 py-2 shadow-inner">45</span><span className="text-[10px] text-white/80 mt-1 uppercase">Mins</span></div>
                  <span className="py-2 animate-pulse">:</span>
                  <div className="flex flex-col"><span className="bg-white text-brand-red rounded-lg px-3 py-2 shadow-inner">30</span><span className="text-[10px] text-white/80 mt-1 uppercase">Secs</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          
          {/* Search */}
          <div className="flex justify-end mb-8">
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="Search exclusive deals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent shadow-sm transition-all"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg shadow-sm">
              <p className="text-red-700 font-medium">{error}</p>
              <button 
                onClick={fetchProducts} 
                className="mt-2 text-sm text-red-600 hover:text-red-800 underline font-medium"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 animate-pulse">
                  <div className="h-48 bg-slate-200 rounded-xl mb-4 w-full"></div>
                  <div className="flex justify-between items-start mb-2">
                    <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                    <div className="h-6 bg-slate-200 rounded-full w-20"></div>
                  </div>
                  <div className="h-6 bg-slate-200 rounded w-3/4 mb-4"></div>
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100">
                    <div className="h-6 bg-slate-200 rounded w-1/4"></div>
                    <div className="h-10 bg-slate-200 rounded-lg w-10"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredDeals.length === 0 && !error ? (
            /* Empty State */
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
              <Tag className="mx-auto h-16 w-16 text-slate-300 mb-4" />
              <h3 className="text-xl font-bold text-slate-700 mb-2">No Deals Found</h3>
              <p className="text-slate-500 max-w-md mx-auto">
                {searchTerm 
                  ? `We couldn't find any deals matching "${searchTerm}". Try adjusting your search.` 
                  : "We're currently updating our catalog with fresh new deals! Check back later today."}
              </p>
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm("")}
                  className="mt-6 px-6 py-2 bg-brand-red text-white rounded-full font-medium hover:bg-red-600 transition-colors"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            /* Deals Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredDeals.map((product) => (
                <DealCard key={product._id} product={product} />
              ))}
            </div>
          )}

        </div>
      </main>
      
      <Footer />
    </div>
  );
}

function DealCard({ product }) {
  const discountPercent = getDiscountForProduct(product._id);
  const originalPrice = product.price;
  const discountedPrice = Math.floor(originalPrice - (originalPrice * (discountPercent / 100)));

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col h-full hover:-translate-y-1 relative">
      
      {/* Featured Border Effect */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-red to-brand-orange"></div>
      
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-slate-100 p-4 pt-6">
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 rounded-xl"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/400?text=No+Image";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            <Package size={48} />
          </div>
        )}
        
        {/* Discount Badge */}
        <div className="absolute top-3 right-3 shadow-lg z-10 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          <div className="bg-brand-red text-white font-black text-sm px-3 py-2 rounded-xl flex flex-col items-center leading-none transform rotate-3">
            <span className="text-lg">{discountPercent}%</span>
            <span className="text-[10px] uppercase tracking-wider opacity-90 mx-1">OFF</span>
          </div>
        </div>
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-white/90 backdrop-blur-md text-xs font-bold px-3 py-1.5 rounded-full text-slate-700 shadow-sm border border-slate-100">
            {product.category}
          </span>
        </div>
      </div>
      
      {/* Content Container */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-bold text-lg text-slate-900 mb-2 line-clamp-2 leading-snug group-hover:text-brand-red transition-colors">
          {product.name}
        </h3>
        
        {/* Flash deal indicator */}
        <div className="flex items-center gap-1.5 text-brand-orange text-xs font-bold uppercase tracking-wider mb-3">
          <Zap size={14} className="fill-brand-orange" /> Selling Fast
        </div>
        
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            {/* Price block */}
            <div className="flex items-baseline gap-2">
              <span className="text-xl md:text-2xl font-black text-brand-red">
                ₹{discountedPrice.toLocaleString('en-IN')}
              </span>
              <span className="text-sm font-medium text-slate-400 line-through">
                ₹{originalPrice.toLocaleString('en-IN')}
              </span>
            </div>
            {/* Savings */}
            <span className="text-xs font-bold text-emerald-600 mt-0.5">
              Save ₹{(originalPrice - discountedPrice).toLocaleString('en-IN')}
            </span>
          </div>
          
          <button 
            className="h-12 w-12 rounded-xl bg-slate-900 text-white flex items-center justify-center hover:bg-brand-red transition-colors shadow-md hover:shadow-[0_8px_20px_rgba(239,68,68,0.3)] transform hover:-translate-y-1"
            title="Add to Cart"
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
