import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router";
import axiosClient from "../utility/axios";
import { ChevronLeft, ChevronRight, Clock, CheckCircle, XCircle, ShoppingBag } from "lucide-react";
import logo from "../assets/logo.png";

const STATUS_STYLES = {
  Pending:   { cls: "bg-yellow-400/20 text-yellow-300 border-yellow-400/40", icon: <Clock size={13} /> },
  Completed: { cls: "bg-green-400/20 text-green-300 border-green-400/40",   icon: <CheckCircle size={13} /> },
  Cancelled: { cls: "bg-red-400/20 text-red-300 border-red-400/40",          icon: <XCircle size={13} /> },
};

// Shimmer skeleton row
const SkeletonRow = () => (
  <div className="animate-pulse bg-white/5 rounded-2xl p-5 border border-white/10 space-y-3">
    <div className="flex justify-between">
      <div className="h-4 w-32 bg-white/20 rounded" />
      <div className="h-5 w-20 bg-white/20 rounded-full" />
    </div>
    <div className="h-4 w-48 bg-white/10 rounded" />
    <div className="h-4 w-24 bg-white/10 rounded" />
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
    <div className="min-h-screen font-sans flex flex-col bg-slate-800 bg-gradient-to-br from-indigo-500/40 via-purple-500/40 to-slate-800/40">
      {/* Navbar */}
      <nav className="relative z-20 px-8 py-5 border-b border-white/20 flex items-center justify-between bg-white/10 backdrop-blur-md">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="bg-white/10 p-2 rounded-xl group-hover:bg-white/20 transition-all">
            <img src={logo} alt="StoodoMart" className="w-8 h-auto" />
          </div>
          <h1 className="text-xl font-extrabold text-white tracking-tight">Stoodo<span className="text-purple-400">Mart</span></h1>
        </Link>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/checkout")}
            className="px-5 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 hover:-translate-y-0.5 transition-all active:scale-95"
          >
            + New Order
          </button>
          <Link to="/profile" className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-xl transition-all border border-white/10">
            Back to Profile
          </Link>
        </div>
      </nav>

      <main className="flex-grow p-6 sm:p-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-extrabold text-white mb-1">My Orders</h2>
          <p className="text-slate-300 mb-8 text-sm">Track your order history and status updates.</p>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/50 text-red-200 text-sm">{error}</div>
          )}

          {loading ? (
            <div className="space-y-4">{[...Array(4)].map((_, i) => <SkeletonRow key={i} />)}</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-24 flex flex-col items-center gap-5">
              <div className="bg-white/10 p-6 rounded-full">
                <ShoppingBag size={48} className="text-purple-400" />
              </div>
              <p className="text-white font-bold text-xl">No orders yet</p>
              <p className="text-slate-400 text-sm">Place your first order to get started!</p>
              <button
                onClick={() => navigate("/checkout")}
                className="mt-2 px-8 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 hover:-translate-y-0.5 transition-all"
              >
                Shop Now
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const statusInfo = STATUS_STYLES[order.status] || STATUS_STYLES.Pending;
                return (
                  <div key={order._id} className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-5 hover:bg-white/15 transition-all">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <p className="text-xs text-slate-400 font-mono mb-1">Order #{order._id.slice(-8).toUpperCase()}</p>
                        <p className="text-white font-bold text-lg">Rs. {order.totalAmount.toLocaleString()}</p>
                      </div>
                      <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${statusInfo.cls}`}>
                        {statusInfo.icon}{order.status}
                      </span>
                    </div>
                    <p className="text-slate-300 text-sm mb-3">
                      <span className="text-slate-400">Address:</span> {order.address}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {order.products.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-1.5 text-xs text-slate-300 border border-white/10">
                          {item.productId?.image && (
                            <img src={item.productId.image} alt="" className="w-5 h-5 rounded-full object-cover" />
                          )}
                          <span className="font-medium">{item.productId?.name || "Product"}</span>
                          <span className="text-slate-400">x{item.quantity}</span>
                          <span className="text-indigo-300">Rs. {item.price}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-10">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-xl bg-white/10 border border-white/20 text-white disabled:opacity-30 hover:bg-white/20 transition-all"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-slate-300 font-bold text-sm">Page {page} of {totalPages}</span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-xl bg-white/10 border border-white/20 text-white disabled:opacity-30 hover:bg-white/20 transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
