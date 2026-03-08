import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router";
import axiosClient from "../utility/axios";
import {
  ChevronLeft, ChevronRight, Trash2, RefreshCw,
  CheckCircle, Clock, XCircle, ShoppingCart, AlertCircle
} from "lucide-react";
import logo from "../assets/logo.png";

const STATUS_STYLES = {
  Pending:   { badge: "bg-yellow-400/20 text-yellow-300 border-yellow-400/40", dot: "bg-yellow-400", icon: <Clock size={13} /> },
  Completed: { badge: "bg-green-400/20 text-green-300 border-green-400/40",   dot: "bg-green-400",  icon: <CheckCircle size={13} /> },
  Cancelled: { badge: "bg-red-400/20 text-red-300 border-red-400/40",         dot: "bg-red-400",   icon: <XCircle size={13} /> },
};
const STATUSES = ["Pending", "Completed", "Cancelled"];

const SkeletonRow = () => (
  <tr className="animate-pulse border-b border-white/10">
    {[...Array(6)].map((_, i) => (
      <td key={i} className="py-4 px-4">
        <div className="h-4 bg-white/15 rounded w-full" />
      </td>
    ))}
  </tr>
);

export default function AdminOrders() {
  const [orders, setOrders]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = { page, limit: 10 };
      if (statusFilter) params.status = statusFilter;
      const res = await axiosClient.get("/order/getallorders", { params });
      setOrders(res.data.orders || []);
      setTotalPages(res.data.totalPages || 1);
      setTotalOrders(res.data.totalOrders || 0);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    if (!window.confirm(`Change status to "${newStatus}"?`)) return;
    setUpdatingId(orderId);
    try {
      await axiosClient.put(`/order/updateorder/${orderId}`, { status: newStatus });
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm("Are you sure you want to permanently delete this order? This cannot be undone.")) return;
    setDeletingId(orderId);
    try {
      await axiosClient.delete(`/order/deleteorder/${orderId}`);
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete order");
    } finally {
      setDeletingId(null);
    }
  };

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
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-4 py-2 bg-white/10 border border-white/20 text-white text-sm font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 [&>option]:bg-slate-800 cursor-pointer"
          >
            <option value="">All Statuses</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <button
            onClick={fetchOrders}
            className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 transition-all"
            title="Refresh"
          >
            <RefreshCw size={18} />
          </button>
          <Link to="/profile" className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-xl transition-all border border-white/10">
            Back to Profile
          </Link>
        </div>
      </nav>

      <main className="flex-grow p-6 sm:p-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-extrabold text-white mb-1">All Orders</h2>
              <p className="text-slate-300 text-sm">{totalOrders} total orders {statusFilter ? `(filtered: ${statusFilter})` : ""}</p>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/50 text-red-200 text-sm flex items-center gap-3">
              <AlertCircle size={18} className="shrink-0" />{error}
            </div>
          )}

          <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10 text-slate-300 uppercase tracking-wider text-xs">
                    <th className="py-4 px-5 font-bold">Order ID</th>
                    <th className="py-4 px-5 font-bold">Customer</th>
                    <th className="py-4 px-5 font-bold">Products</th>
                    <th className="py-4 px-5 font-bold">Total</th>
                    <th className="py-4 px-5 font-bold">Status</th>
                    <th className="py-4 px-5 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
                  ) : orders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-20 text-center">
                        <div className="flex flex-col items-center gap-4 text-slate-400">
                          <ShoppingCart size={48} className="text-purple-400/50" />
                          <p className="font-bold text-white">No orders found</p>
                          {statusFilter && <p className="text-sm">Try removing the status filter</p>}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => {
                      const statusInfo = STATUS_STYLES[order.status] || STATUS_STYLES.Pending;
                      return (
                        <tr key={order._id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                          {/* Order ID */}
                          <td className="py-4 px-5">
                            <span className="font-mono text-xs text-indigo-300">#{order._id.slice(-8).toUpperCase()}</span>
                            <p className="text-slate-500 text-xs mt-0.5">{new Date(order.createdAt).toLocaleDateString("en-IN")}</p>
                          </td>
                          {/* Customer */}
                          <td className="py-4 px-5">
                            {order.userId ? (
                              <div>
                                <p className="text-white font-semibold text-sm">{order.userId.firstname} {order.userId.lastname}</p>
                                <p className="text-slate-400 text-xs">{order.userId.email}</p>
                              </div>
                            ) : (
                              <span className="text-slate-500 text-xs">Unknown</span>
                            )}
                          </td>
                          {/* Products */}
                          <td className="py-4 px-5">
                            <div className="flex flex-col gap-1 max-w-[200px]">
                              {order.products.slice(0, 2).map((item, idx) => (
                                <span key={idx} className="text-xs text-slate-300 truncate">
                                  {item.productId?.name || "Product"} <span className="text-slate-500">x{item.quantity}</span>
                                </span>
                              ))}
                              {order.products.length > 2 && (
                                <span className="text-xs text-slate-500">+{order.products.length - 2} more</span>
                              )}
                            </div>
                          </td>
                          {/* Total */}
                          <td className="py-4 px-5">
                            <span className="text-white font-bold">Rs. {order.totalAmount.toLocaleString()}</span>
                          </td>
                          {/* Status */}
                          <td className="py-4 px-5">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${statusInfo.badge}`}>
                              {statusInfo.icon}{order.status}
                            </span>
                          </td>
                          {/* Actions */}
                          <td className="py-4 px-5">
                            <div className="flex items-center gap-2 justify-end">
                              {/* Status change dropdown */}
                              <select
                                value={order.status}
                                onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                disabled={updatingId === order._id}
                                className="py-1.5 px-2 bg-white/10 border border-white/20 text-white text-xs font-bold rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-50 [&>option]:bg-slate-800 cursor-pointer transition-all hover:bg-white/20"
                              >
                                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                              </select>
                              {/* Delete */}
                              <button
                                onClick={() => handleDelete(order._id)}
                                disabled={deletingId === order._id}
                                className="p-1.5 bg-red-500/20 hover:bg-red-500/40 text-red-300 rounded-lg border border-red-500/30 transition-all disabled:opacity-50 active:scale-95"
                                title="Delete order"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

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
