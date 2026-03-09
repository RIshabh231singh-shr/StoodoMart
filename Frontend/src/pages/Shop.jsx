import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router";
import axiosClient from "../utility/axios";
import { Search, Loader2, Package, ShoppingCart } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      // Assuming GET /product/getallproduct supports page 
      const res = await axiosClient.get("/product/getallproduct", {
        params: { page },
      });
      // The backend returns an object with `{ message: "...", allproduct: [...] }`
      setProducts(res.data.allproduct || []);
      // If the backend doesn't return totalPages for this endpoint, default to 1 for now
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load products. Please check your connection.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Client-side filtering as a fallback if the API doesn't support search
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen font-sans flex flex-col bg-slate-50 text-slate-900">
      <Header />

      <main className="flex-grow pt-32 pb-16">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">

          {/* Shop Header & Search */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2">All Products</h1>
              <div className="w-16 h-1.5 bg-brand-teal rounded-full mb-4"></div>
              <p className="text-slate-600">Discover everything you need for campus life.</p>
            </div>

            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="Search products by name or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent shadow-sm transition-all"
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
          ) : filteredProducts.length === 0 && !error ? (
            /* Empty State */
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
              <Package className="mx-auto h-16 w-16 text-slate-300 mb-4" />
              <h3 className="text-xl font-bold text-slate-700 mb-2">No Products Found</h3>
              <p className="text-slate-500 max-w-md mx-auto">
                {searchTerm
                  ? `We couldn't find any products matching "${searchTerm}". Try adjusting your search.`
                  : "There are currently no products available in the store. Please check back later!"}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="mt-6 px-6 py-2 bg-slate-900 text-white rounded-full font-medium hover:bg-brand-teal transition-colors"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            /* Products Grid */
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-16 flex justify-center">
                  <div className="flex gap-2 bg-white p-2 rounded-full shadow-sm border border-slate-100">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 rounded-full font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                    >
                      Previous
                    </button>
                    <div className="flex items-center justify-center px-4 bg-slate-50 text-slate-900 font-bold rounded-full">
                      {page} / {totalPages}
                    </div>
                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="px-4 py-2 rounded-full font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}

function ProductCard({ product }) {
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
            disabled={product.stock <= 0}
            className="h-10 w-10 rounded-xl bg-slate-900 text-white flex items-center justify-center hover:bg-brand-teal transition-colors disabled:opacity-50 disabled:hover:bg-slate-900 shadow-md hover:shadow-lg disabled:shadow-none"
            title={product.stock > 0 ? "View Details" : "Out of Stock"}
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
