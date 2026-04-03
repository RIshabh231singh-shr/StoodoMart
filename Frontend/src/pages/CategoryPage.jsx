import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import axiosClient from '../utility/axios';
import { useSelector } from 'react-redux';
import { selectCurrentCollege } from '../CollegeSlice';
import { Package } from 'lucide-react';

export default function CategoryPage() {
  const { slug } = useParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const currentCollege = useSelector(selectCurrentCollege);

  // Format the slug back into a readable title for the header
  const title = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .replace(" & ", " And ");

  const fetchCategoryProducts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const fetchParams = { page };
      if (currentCollege && currentCollege !== "Select College") {
        fetchParams.college = currentCollege;
      }

      const res = await axiosClient.get(`/product/category/${slug}`, {
        params: fetchParams
      });
      setProducts(res.data.products || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load category products. Please try again.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [slug, page, currentCollege]);

  useEffect(() => {
    // Reset page to 1 when category changes
    setPage(1);
  }, [slug]);

  useEffect(() => {
    fetchCategoryProducts();
  }, [fetchCategoryProducts]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-12 md:py-32 lg:max-w-7xl">
        <div className="mb-8 flex items-center gap-2 text-sm text-slate-500">
          <Link to="/" className="hover:text-brand-teal transition-colors">Home</Link>
          <span>/</span>
          <Link to="/categories" className="hover:text-brand-teal transition-colors">Categories</Link>
          <span>/</span>
          <span className="text-brand-teal font-medium">{title}</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-black mb-2 tracking-tight">
              {title}
            </h1>
            <div className="w-16 h-1.5 bg-brand-teal rounded-full mb-4"></div>
            <p className="text-slate-600">Explore all available products in this category.</p>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg shadow-sm">
            <p className="text-red-700 font-medium">{error}</p>
            <button
              onClick={fetchCategoryProducts}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline font-medium"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
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
        ) : products.length === 0 && !error ? (
          /* Empty State */
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <Package className="mx-auto h-16 w-16 text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-700 mb-2">No Products Found</h3>
            <p className="text-slate-500 max-w-md mx-auto">
              We are currently sourcing the best products for the <strong>{title}</strong> category. Check back soon!
            </p>
            <Link
              to="/shop"
              className="mt-6 inline-block px-6 py-2 bg-slate-900 text-white rounded-full font-medium hover:bg-brand-teal transition-colors"
            >
              Browse All Products
            </Link>
          </div>
        ) : (
          /* Products Grid */
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product) => (
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
      </main>

      <Footer />
    </div>
  );
}
