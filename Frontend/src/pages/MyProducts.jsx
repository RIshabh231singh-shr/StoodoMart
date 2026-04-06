import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router";
import axiosClient from "../utility/axios";
import { Edit2, Trash2, ShieldAlert, ChevronLeft, ChevronRight, Package, Plus, ArrowLeft } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function MyProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axiosClient.get("/product/myproducts", {
        params: { page, limit: 10 },
      });
      setProducts(res.data.products || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      if (err.response?.status === 404) {
          setProducts([]);
          setTotalPages(1);
      } else {
          setError(err.response?.data?.message || "Failed to fetch your products");
          setProducts([]);
      }
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axiosClient.delete(`/product/deleteproduct/${id}`);
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete product");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900">
      <Header />

      <main className="flex-grow pt-32 pb-24 container mx-auto px-4 md:px-8 max-w-6xl">
        
        {/* Navigation Breadcrumbs / Back button */}
        <div className="flex items-center justify-between mb-8">
            <button 
              onClick={() => navigate("/profile")}
              className="flex items-center gap-2 text-slate-500 hover:text-brand-teal font-bold transition-colors group"
            >
             <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Profile
            </button>
            <button 
              onClick={() => navigate("/add-product")}
              className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-black rounded-2xl shadow-xl shadow-slate-200 transition-all hover:bg-brand-teal hover:-translate-y-1 active:scale-95 group"
            >
              <Plus size={20} /> Add Product
            </button>
        </div>

        <header className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-tight mb-2">My Inventory</h1>
          <p className="text-slate-500 font-medium">Manage your products and their availability on campus.</p>
        </header>
        
        {error && (
          <div className="mb-8 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-center gap-3 font-bold">
            <ShieldAlert size={20} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Product Table / List */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden relative min-h-[400px]">
          <div className="absolute top-0 left-0 w-full h-1 bg-brand-teal"></div>
          
          {loading ? (
             <div className="p-8 animate-pulse space-y-6">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="flex gap-6 items-center w-full py-4 border-b border-slate-50">
                     <div className="w-16 h-16 bg-slate-100 rounded-2xl flex-shrink-0"></div>
                     <div className="h-6 bg-slate-100 rounded w-1/4"></div>
                     <div className="h-6 bg-slate-100 rounded w-1/6"></div>
                     <div className="h-10 bg-slate-100 rounded-xl w-24 ml-auto"></div>
                  </div>
                ))}
             </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 px-8 text-center">
              <div className="w-24 h-24 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 mb-6">
                <Package size={48} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Inventory is empty</h2>
              <p className="text-slate-500 max-w-xs mb-8">You haven't added any products to your campus store yet.</p>
              <button 
                onClick={() => navigate('/add-product')}
                className="px-8 py-4 bg-brand-teal text-slate-900 font-black rounded-2xl transition-all shadow-lg shadow-brand-teal/20 hover:shadow-brand-teal/40 hover:-translate-y-1 active:scale-95"
              >
                Add Your First Product
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest px-8">
                    <th className="py-6 px-10">Product Details</th>
                    <th className="py-6 px-4">Category</th>
                    <th className="py-6 px-4">Price</th>
                    <th className="py-6 px-4">Stock</th>
                    <th className="py-6 px-10 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {products.map((product) => (
                    <tr key={product._id} className="group hover:bg-slate-50/50 transition-all duration-300">
                      <td className="py-6 px-10">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0 shadow-sm">
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            </div>
                            <span className="font-bold text-slate-800 tracking-tight text-base line-clamp-2">
                              {product.name}
                            </span>
                        </div>
                      </td>
                      <td className="py-6 px-4">
                        <span className="px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border bg-indigo-50/50 text-indigo-500 border-indigo-100">
                          {product.category}
                        </span>
                      </td>
                      <td className="py-6 px-4 text-slate-900 font-black tracking-tight">
                        Rs. {product.price.toLocaleString('en-IN')}
                      </td>
                      <td className="py-6 px-4">
                        <div className={`flex items-center gap-2 text-xs font-black uppercase tracking-tighter ${product.stock > 10 ? 'text-emerald-500' : product.stock > 0 ? 'text-orange-500' : 'text-red-500'}`}>
                          <div className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-emerald-500' : product.stock > 0 ? 'bg-orange-500' : 'bg-red-500'} animate-pulse`}></div>
                          {product.stock} {product.stock === 0 ? 'Out of stock' : 'in Stock'}
                        </div>
                      </td>
                      <td className="py-6 px-10 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <Link
                            to={`/update-product/${product._id}`}
                            className="p-3 text-slate-400 hover:text-brand-teal bg-white border border-slate-100 rounded-xl transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95"
                            title="Edit Product"
                          >
                            <Edit2 size={18} />
                          </Link>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="p-3 text-slate-400 hover:text-red-500 bg-white border border-slate-100 rounded-xl transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95"
                            title="Delete Product"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Footer */}
          {!loading && totalPages > 1 && (
            <footer className="p-8 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
              <div className="text-xs font-black uppercase tracking-widest text-slate-400">
                Page <span className="text-slate-900">{page}</span> of {totalPages}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-30 transition-all shadow-sm active:scale-95"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-30 transition-all shadow-sm active:scale-95"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </footer>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
