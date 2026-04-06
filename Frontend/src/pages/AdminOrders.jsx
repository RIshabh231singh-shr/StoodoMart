import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router";
import axiosClient from "../utility/axios";
import {
  ChevronLeft, ChevronRight, Trash2, RefreshCw,
  CheckCircle, Clock, XCircle, ShoppingCart, AlertCircle, ArrowLeft, Filter, Search
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const STATUS_STYLES = {
  Pending:   { badge: "bg-amber-50 text-amber-600 border-amber-100", icon: <Clock size={13} /> },
  Completed: { badge: "bg-emerald-50 text-emerald-600 border-emerald-100",   icon: <CheckCircle size={13} /> },
  Cancelled: { badge: "bg-rose-50 text-rose-600 border-rose-100",          icon: <XCircle size={13} /> },
};
const STATUSES = ["Pending", "Completed", "Cancelled"];

const SkeletonRow = () => (
  <tr className="animate-pulse border-b border-slate-50">
    {[...Array(6)].map((_, i) => (
      <td key={i} className="py-6 px-6">
        <div className="h-4 bg-slate-100 rounded w-full" />
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
  const navigate = useNavigate();

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
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900">
      <Header />

      <main className="flex-grow pt-32 pb-24 container mx-auto px-4 md:px-8 max-w-7xl">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <button 
                onClick={() => navigate("/profile")}
                className="flex items-center gap-2 text-slate-500 hover:text-brand-teal font-bold mb-4 transition-colors group"
              >
               <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
              </button>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-tight mb-2">Global Orders</h1>
              <p className="text-slate-500 font-medium">{totalOrders.toLocaleString()} orders recorded across the platform.</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative group">
                <Filter size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-teal transition-colors" />
                <select
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                  className="pl-11 pr-10 py-3 bg-white border border-slate-200 text-slate-700 font-black text-xs uppercase tracking-widest rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-teal/10 focus:border-brand-teal appearance-none cursor-pointer shadow-sm transition-all"
                >
                  <option value="">All Statuses</option>
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <button
                onClick={fetchOrders}
                className="p-3 bg-white text-slate-500 hover:text-brand-teal border border-slate-200 rounded-2xl transition-all shadow-sm active:scale-95"
                title="Refresh List"
              >
                <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
              </button>
            </div>
        </div>

        {error && (
          <div className="mb-8 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-center gap-3 font-bold">
            <AlertCircle size={18} className="shrink-0" />{error}
          </div>
        )}

        {/* Orders Table Container */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden relative min-h-[500px]">
          <div className="absolute top-0 left-0 w-full h-1 bg-brand-teal"></div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 uppercase tracking-widest text-[10px] font-black">
                  <th className="py-6 px-8">Order Timeline</th>
                  <th className="py-6 px-6">Customer Details</th>
                  <th className="py-6 px-6">Item Breakdown</th>
                  <th className="py-6 px-6">Financials</th>
                  <th className="py-6 px-6 text-center">Status</th>
                  <th className="py-6 px-8 text-right">Management</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-32 text-center">
                      <div className="flex flex-col items-center gap-4 text-slate-300">
                        <div className="w-20 h-20 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-2">
                           <ShoppingCart size={40} />
                        </div>
                        <p className="font-black text-slate-900 text-xl tracking-tight">No match found</p>
                        <p className="text-slate-500 max-w-xs mx-auto">No orders match your current filter selection. Try adjusting your status criteria.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => {
                    const statusInfo = STATUS_STYLES[order.status] || STATUS_STYLES.Pending;
                    return (
                      <tr key={order._id} className="group hover:bg-slate-50/50 transition-colors">
                        {/* Order Timeline */}
                        <td className="py-6 px-8">
                          <div className="flex flex-col">
                            <span className="font-mono text-xs font-bold text-brand-teal bg-brand-teal/5 px-2 py-0.5 rounded-md self-start mb-1">#{order._id.slice(-8).toUpperCase()}</span>
                            <span className="text-slate-500 text-[10px] font-black uppercase tracking-wider">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                          </div>
                        </td>
                        {/* Customer */}
                        <td className="py-6 px-6">
                          {order.userId ? (
                            <div className="flex flex-col">
                              <p className="text-slate-900 font-bold text-sm tracking-tight">{order.userId.firstname} {order.userId.lastname}</p>
                              <p className="text-slate-400 text-xs truncate max-w-[150px]">{order.userId.email}</p>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">Anonymous</span>
                          )}
                        </td>
                        {/* Products */}
                        <td className="py-6 px-6">
                          <div className="flex flex-col gap-1.5">
                            {order.products.slice(0, 1).map((item, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-700 line-clamp-1">{item.productId?.name || "Product"}</span>
                                <span className="bg-slate-100 text-slate-500 text-[9px] font-black px-1.5 py-0.5 rounded">x{item.quantity}</span>
                              </div>
                            ))}
                            {order.products.length > 1 && (
                              <span className="text-[10px] font-black text-brand-teal uppercase tracking-widest">+{order.products.length - 1} more items</span>
                            )}
                          </div>
                        </td>
                        {/* Total */}
                        <td className="py-6 px-6">
                          <span className="text-slate-900 font-black text-base tracking-tight">Rs. {order.totalAmount.toLocaleString('en-IN')}</span>
                        </td>
                        {/* Status */}
                        <td className="py-6 px-6 text-center">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusInfo.badge}`}>
                            {statusInfo.icon}{order.status}
                          </span>
                        </td>
                        {/* Actions */}
                        <td className="py-6 px-8">
                          <div className="flex items-center gap-3 justify-end">
                            <div className="relative">
                               <select
                                value={order.status}
                                onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                disabled={updatingId === order._id}
                                className="pl-4 pr-8 py-2 bg-slate-50 border border-slate-200 text-slate-700 text-xs font-black uppercase tracking-widest rounded-xl focus:outline-none focus:ring-4 focus:ring-brand-teal/10 focus:border-brand-teal disabled:opacity-50 appearance-none cursor-pointer hover:bg-white transition-all shadow-sm"
                              >
                                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                              </select>
                              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <RefreshCw size={10} className={updatingId === order._id ? "animate-spin" : ""} />
                              </div>
                            </div>
                            
                            <button
                              onClick={() => handleDelete(order._id)}
                              disabled={deletingId === order._id}
                              className="p-2.5 bg-white hover:bg-red-50 text-slate-300 hover:text-red-500 border border-slate-100 hover:border-red-100 rounded-xl transition-all shadow-sm active:scale-95"
                              title="Delete Permanent"
                            >
                              <Trash2 size={16} />
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

          {/* Pagination Footer */}
          {!loading && totalPages > 1 && (
            <footer className="p-8 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Segment <span className="text-slate-900">{page}</span> of {totalPages}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-30 transition-all shadow-sm active:scale-95"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-30 transition-all shadow-sm active:scale-95"
                >
                  <ChevronRight size={20} />
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
