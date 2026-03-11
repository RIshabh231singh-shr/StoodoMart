import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import axiosClient from "../utility/axios";
import { Search, Loader2, Package, ShoppingCart } from "lucide-react";
import { selectCurrentCollege } from "../CollegeSlice";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const currentCollege = useSelector(selectCurrentCollege);

  // Pre-fill search from header's URL query param (?q=...)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q');
    if (q) {
      setSearchTerm(decodeURIComponent(q));
      // Clean the URL so refreshing doesn't re-apply the old search
      navigate('/shop', { replace: true });
    }
  }, []);  // only run once on mount

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const fetchParams = { page };
      if (currentCollege && currentCollege !== "Select College") {
        fetchParams.college = currentCollege;
      }
      const res = await axiosClient.get("/product/getallproduct", {
        params: fetchParams,
      });
      setProducts(res.data.allproduct || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load products. Please check your connection.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [page, currentCollege]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Client-side filtering (Safely handled in case name/category is missing)
  const filteredProducts = products.filter(product => {
    const nameMatch = product?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const categoryMatch = product?.category?.toLowerCase().includes(searchTerm.toLowerCase());
    return nameMatch || categoryMatch;
  });

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

          {/* ----- STATE 1: ERROR ----- */}
          {error && !loading && (
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

          {/* ----- STATE 2: LOADING ----- */}
          {loading && (
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
          )}

          {/* ----- STATE 3: EMPTY (No Products Found) ----- */}
          {!loading && !error && filteredProducts.length === 0 && (
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
          )}

          {/* ----- STATE 4: SHOW PRODUCTS ----- */}
          {!loading && !error && filteredProducts.length > 0 && (
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