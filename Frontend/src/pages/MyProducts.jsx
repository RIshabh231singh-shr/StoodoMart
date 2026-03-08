import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router";
import axiosClient from "../utility/axios";
import { Search, Edit2, Trash2, ShieldAlert, ChevronLeft, ChevronRight, Package, Loader2 } from "lucide-react";
import logo from "../assets/logo.png";

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
    <div className="min-h-screen font-sans flex flex-col relative overflow-hidden bg-slate-800 bg-gradient-to-br from-indigo-500/40 via-purple-500/40 to-slate-800/40">
      
      {/* Navbar Integration */}
      <nav className="relative z-20 px-8 py-5 border-b border-white/20 flex items-center justify-between w-full bg-white/10 backdrop-blur-md">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md transition-all duration-300 group-hover:bg-white/20 group-hover:scale-105 shadow-sm">
            <img src={logo} alt="StoodoMart Logo" className="w-8 h-auto transform group-hover:-rotate-6 transition-transform duration-300" />
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-white drop-shadow-md">
            Stoodo<span className="text-purple-400">Mart</span>
          </h1>
        </Link>
        
        <div className="flex items-center gap-6">
          <Link
            to="/profile"
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold bg-white/10 text-white hover:bg-white/20 transition-all backdrop-blur-md active:scale-95 border border-white/10 shadow-lg"
          >
            <ChevronLeft size={18} />
            <span>Back to Profile</span>
          </Link>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 p-8 max-w-7xl mx-auto w-full">
        {/* Header and Error */}
        <div className="mb-6 flex items-center justify-between">
            <h2 className="text-3xl font-extrabold text-white drop-shadow-md flex items-center gap-3">
              <Package className="text-purple-400" size={32} />
              My Products
            </h2>
        </div>
        
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/50 text-red-100 flex items-center gap-3 backdrop-blur-sm">
            <ShieldAlert size={20} />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Loading / List */}
        {loading ? (
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-6 overflow-hidden">
             <div className="animate-pulse flex flex-col gap-6">
                 {/* Table Header Skeleton */}
                 <div className="flex gap-4 items-center w-full pb-4 border-b border-white/10">
                     <div className="h-6 bg-white/20 rounded w-16"></div>
                     <div className="h-6 bg-white/20 rounded w-1/4"></div>
                     <div className="h-6 bg-white/20 rounded w-1/6"></div>
                     <div className="h-6 bg-white/20 rounded w-1/6 ml-auto"></div>
                 </div>
                 {/* Rows Skeleton */}
                 {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="flex gap-6 items-center w-full py-2">
                       <div className="w-16 h-16 bg-white/20 rounded-xl flex-shrink-0"></div>
                       <div className="h-5 bg-white/20 rounded w-1/4"></div>
                       <div className="h-5 bg-white/20 rounded w-1/6 border-white/10"></div>
                       <div className="h-8 bg-white/20 rounded-xl w-24 ml-auto mr-4"></div>
                    </div>
                 ))}
             </div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-slate-300 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
            <Package size={56} className="mx-auto mb-4 opacity-50 text-indigo-300" />
            <p className="text-xl font-medium mb-4">You haven't created any products yet.</p>
            <button 
              onClick={() => navigate('/add-product')}
              className="px-6 py-2.5 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-xl transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
            >
              Add Your First Product
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden transform transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10 text-slate-300 text-sm">
                    <th className="py-5 px-6 font-bold uppercase tracking-wider">Product</th>
                    <th className="py-5 px-6 font-bold uppercase tracking-wider">Category</th>
                    <th className="py-5 px-6 font-bold uppercase tracking-wider">Price   </th>
                    <th className="py-5 px-6 font-bold uppercase tracking-wider">Stock</th>
                    <th className="py-5 px-6 font-bold uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {products.map((product) => (
                    <tr key={product._id} className="group hover:bg-white/10 transition-all duration-300 ease-in-out cursor-default">
                      <td className="py-4 px-6 text-white">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-xl overflow-hidden object-cover bg-slate-900 border border-white/20 flex-shrink-0">
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <span className="font-bold text-white tracking-wide text-lg drop-shadow-sm line-clamp-2">
                              {product.name}
                            </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-3 py-1.5 text-xs font-bold rounded-full shadow-sm transition-all duration-300 border backdrop-blur-md bg-purple-500/20 text-purple-200 border-purple-400/50">
                          {product.category}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-indigo-300 font-bold tracking-wide">
                        {product.price.toLocaleString('en-IN')}
                      </td>
                      <td className="py-4 px-6">
                        <div className={`font-bold ${product.stock > 10 ? 'text-green-400' : product.stock > 0 ? 'text-orange-400' : 'text-red-400'}`}>
                          {product.stock} {product.stock === 0 && '(Out of stock)'}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-3 opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                          <Link
                            to={`/update-product/${product._id}`}
                            className="p-2.5 text-indigo-300 hover:text-white bg-indigo-500/20 hover:bg-indigo-500/50 border border-transparent hover:border-indigo-400/50 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
                            title="Update Product"
                          >
                            <Edit2 size={20} />
                          </Link>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="p-2.5 text-red-400 hover:text-white bg-red-500/20 hover:bg-red-500/60 border border-transparent hover:border-red-400/50 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
                            title="Delete Product"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="p-5 border-t border-white/10 flex items-center justify-between text-sm text-slate-200 bg-white/5">
                <div className="font-medium bg-white/10 px-4 py-1.5 rounded-full border border-white/10">
                  Page <span className="font-bold text-white">{page}</span> of <span className="font-bold text-white">{totalPages}</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-white disabled:opacity-30 disabled:hover:bg-white/10 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-2.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-white disabled:opacity-30 disabled:hover:bg-white/10 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
