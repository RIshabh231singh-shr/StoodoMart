import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router";
import axiosClient from "../utility/axios";
import { ChevronLeft, ChevronRight, Clock, CheckCircle, XCircle, ShoppingBag, Package, ArrowLeft, Plus } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const STATUS_STYLES = {
  Pending:   { cls: "bg-amber-50 text-amber-600 border-amber-100", icon: <Clock size={14} /> },
  Completed: { cls: "bg-emerald-50 text-emerald-600 border-emerald-100",   icon: <CheckCircle size={14} /> },
  Cancelled: { cls: "bg-rose-50 text-rose-600 border-rose-100",          icon: <XCircle size={14} /> },
};

// Shimmer skeleton row
const SkeletonRow = () => (
  <div className="animate-pulse bg-white rounded-3xl p-6 border border-slate-200 space-y-4 mb-4">
    <div className="flex justify-between items-center">
      <div className="h-4 w-32 bg-slate-100 rounded" />
      <div className="h-6 w-24 bg-slate-100 rounded-full" />
    </div>
    <div className="h-6 w-48 bg-slate-100 rounded" />
    <div className="h-10 w-full bg-slate-50 rounded-2xl" />
  </div>
);

export default function MyOrders() {
  const [orders, setOrders]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [page, setPage]         = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axiosClient.get("/order/myorders", { params: { page, limit: 8 } });
      setOrders(res.data.orders || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900">
      <Header />

      <main className="flex-grow pt-32 pb-24 container mx-auto px-4 md:px-8 max-w-5xl">
        
        {/* Navigation Breadcrumbs */}
        <div className="flex items-center justify-between mb-10">
            <button 
              onClick={() => navigate("/profile")}
              className="flex items-center gap-2 text-slate-500 hover:text-brand-teal font-bold transition-colors group"
            >
             <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Profile
            </button>
            <Link 
              to="/shop"
              className="px-6 py-3 bg-slate-900 text-white font-black rounded-2xl shadow-xl shadow-slate-200 transition-all hover:bg-brand-teal hover:-translate-y-1 active:scale-95 flex items-center gap-2"
            >
              <Plus size={18} /> New Order
            </Link>
        </div>

        <header className="mb-12">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-tight mb-2 flex items-center gap-4">
             <Package size={32} className="text-brand-teal" /> My Orders
          </h1>
          <p className="text-slate-500 font-medium">Track your campus purchases and delivery status updates.</p>
        </header>

        {error && (
          <div className="mb-8 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 font-bold text-sm">{error}</div>
        )}

        <div className="space-y-6">
          {loading ? (
            <div>{[...Array(4)].map((_, i) => <SkeletonRow key={i} />)}</div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 px-8 text-center bg-white rounded-[2.5rem] border border-slate-200 shadow-sm">
              <div className="w-24 h-24 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 mb-6">
                <ShoppingBag size={48} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">No orders yet</h2>
              <p className="text-slate-500 max-w-xs mb-8">Ready to start your first student exchange? Visit the shop to browse deals!</p>
              <button
                onClick={() => navigate("/shop")}
                className="px-10 py-4 bg-brand-teal text-slate-900 font-black rounded-2xl transition-all shadow-lg shadow-brand-teal/20 hover:shadow-brand-teal/40 hover:-translate-y-1 active:scale-95"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {orders.map((order) => {
                const statusInfo = STATUS_STYLES[order.status] || STATUS_STYLES.Pending;
                return (
                  <div key={order._id} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200 hover:shadow-md transition-all group relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-slate-100 group-hover:bg-brand-teal transition-colors"></div>
                    
                    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Order Ref</span>
                          <span className="font-mono text-xs font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded">#{order._id.slice(-8).toUpperCase()}</span>
                        </div>
                        <p className="text-2xl font-black text-slate-900 leading-tight">Rs. {order.totalAmount.toLocaleString('en-IN')}</p>
                      </div>
                      <span className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border ${statusInfo.cls}`}>
                        {statusInfo.icon}{order.status}
                      </span>
                    </header>

                    <div className="space-y-6">
                      <div className="flex items-start gap-3">
                         <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 shrink-0 border border-slate-100">
                           <Clock size={16} />
                         </div>
                         <div className="text-sm font-medium">
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-0.5">Placed On</p>
                            <p className="text-slate-700">{new Date(order.createdAt).toLocaleString("en-IN", { dateStyle: "long", timeStyle: "short" })}</p>
                         </div>
                      </div>

                      <div className="flex items-start gap-3">
                         <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 shrink-0 border border-slate-100">
                           <ShoppingBag size={16} />
                         </div>
                         <div className="w-full">
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1.5">Items Purchased</p>
                            <div className="flex flex-wrap gap-2">
                              {order.products.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs transition-colors hover:bg-slate-100 group/item">
                                  {item.productId?.image && (
                                    <img src={item.productId.image} alt="" className="w-6 h-6 rounded-lg object-cover border border-white" />
                                  )}
                                  <span className="font-black text-slate-700">{item.productId?.name || "Deleted Product"}</span>
                                  <span className="bg-slate-900 text-white text-[10px] px-1.5 rounded-md">x{item.quantity}</span>
                                </div>
                              ))}
                            </div>
                         </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <footer className="flex justify-center items-center gap-6 mt-16 pt-8 border-t border-slate-200">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-4 rounded-2xl bg-white border border-slate-200 text-slate-700 disabled:opacity-30 hover:bg-slate-50 hover:text-brand-teal transition-all shadow-sm active:scale-95"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="text-xs font-black uppercase tracking-widest text-slate-400">
                Page <span className="text-slate-900">{page}</span> of {totalPages}
              </div>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-4 rounded-2xl bg-white border border-slate-200 text-slate-700 disabled:opacity-30 hover:bg-slate-50 hover:text-brand-teal transition-all shadow-sm active:scale-95"
              >
                <ChevronRight size={20} />
              </button>
            </footer>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
