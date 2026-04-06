import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector, useDispatch } from "react-redux";
import { fetchCart, updateCartQuantity, removeFromCart } from "../CartSlice";
import * as z from "zod";
import axiosClient from "../utility/axios";
import {
  MapPin, Package, Plus, Minus, Trash2,
  AlertCircle, CheckCircle, Loader2, ShoppingCart, ArrowLeft, ShoppingBag,
  ExternalLink
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const checkoutSchema = z.object({
  address: z.string().min(5, "Please enter a valid delivery address (min 5 characters)"),
});

export default function PlaceOrder() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux Cart State
  const { cartItems } = useSelector((state) => state.cart);
  
  const [apiError, setApiError]   = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { address: "" },
  });

  // Always ensure cart is up to date on mount
  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleQtyChange = (productId, delta) => {
    const item = cartItems.find((c) => c.productId?._id === productId);
    if (!item) return;

    const newQty = Math.max(1, item.quantity + delta);
    // Boundary check for stock if available in the Redux object
    if (item.productId?.stock && newQty > item.productId.stock) {
        alert(`Only ${item.productId.stock} items left in stock.`);
        return;
    }
    
    dispatch(updateCartQuantity({ productId, quantity: newQty }));
  };

  const handleRemove = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const totalAmount = cartItems.reduce((sum, item) => 
    sum + (item.productId?.price || 0) * item.quantity, 0
  );

  const onSubmit = async (data) => {
    if (cartItems.length === 0) {
      setApiError("Please add at least one product to your order.");
      return;
    }

    setSubmitting(true);
    setApiError("");
    setSuccessMsg("");

    try {
      const payload = {
        address: data.address,
        products: cartItems.map((item) => ({
          productId: item.productId?._id,
          quantity: item.quantity,
        })),
      };

      await axiosClient.post("/order/createorder", payload);
      setSuccessMsg("Order placed successfully! Redirecting to your orders...");
      setTimeout(() => navigate("/my-orders"), 1500);
    } catch (err) {
      setApiError(err.response?.data?.message || "Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900">
      <Header />

      <main className="flex-grow pt-32 pb-24 container mx-auto px-4 md:px-8 max-w-3xl">
        
        {/* Page Header */}
        <div className="mb-12">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-500 hover:text-brand-teal font-bold mb-4 transition-colors group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back
          </button>
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-brand-teal/10 text-brand-teal flex items-center justify-center border border-brand-teal/20 shadow-sm">
               <ShoppingBag size={28} />
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">Checkout</h1>
          </div>
          <p className="text-slate-500 font-medium">Verify your items and enter a secure delivery location.</p>
        </div>

        {apiError && (
          <div className="mb-8 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-center gap-3 font-bold">
            <AlertCircle size={18} className="shrink-0" />
            <span>{apiError}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-8 p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 text-sm flex items-center gap-3 font-bold">
            <CheckCircle size={18} className="shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="space-y-8">
          
          {/* Cart visualization (Main focus for Amazon style checkout) */}
          {cartItems.length > 0 ? (
            <section className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-200">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-8 flex items-center gap-2">
                <ShoppingCart size={14} className="text-brand-teal" /> Order Summary
              </h3>
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div key={item.productId?._id} className="flex items-center gap-6 bg-slate-50 rounded-3xl p-5 border border-slate-100 group transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-100 hover:-translate-y-0.5">
                    {item.productId?.image && (
                      <img src={item.productId.image} alt={item.productId.name} className="w-20 h-20 rounded-2xl object-cover shrink-0 border-4 border-white shadow-sm" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-900 font-black text-base tracking-tight truncate">{item.productId?.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                         <p className="text-slate-500 text-xs font-bold font-mono">ID: {item.productId?._id?.slice(-6).toUpperCase()}</p>
                         <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                         <p className="text-brand-teal text-xs font-black">Rs. {item.productId?.price?.toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-inner">
                      <button 
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handleQtyChange(item.productId?._id, -1)} 
                        className="w-9 h-9 hover:bg-slate-50 text-slate-500 rounded-xl flex items-center justify-center transition-all active:scale-90"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="text-slate-900 font-black text-sm w-8 text-center">{item.quantity}</span>
                      <button 
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handleQtyChange(item.productId?._id, 1)} 
                        className="w-9 h-9 hover:bg-slate-50 text-slate-500 rounded-xl flex items-center justify-center transition-all active:scale-90"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    
                    <div className="hidden md:block text-right w-28">
                       <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-1">Subtotal</p>
                       <p className="text-slate-900 font-black text-base">Rs. {(item.productId?.price * item.quantity).toLocaleString('en-IN')}</p>
                    </div>
                    
                    <button onClick={() => handleRemove(item.productId?._id)} className="text-slate-200 hover:text-rose-500 transition-all p-2.5 hover:bg-rose-50 rounded-xl group-hover:text-slate-300">
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-10 pt-8 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 px-2">
                <div>
                   <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px] mb-1">Standard Logistics</p>
                   <p className="text-emerald-600 font-black text-sm flex items-center gap-2"><CheckCircle size={14} /> FREE Campus Delivery</p>
                </div>
                <div className="text-center sm:text-right">
                    <span className="text-slate-400 font-black uppercase tracking-widest text-xs block mb-1">Gross Amount</span>
                    <span className="text-slate-900 font-black text-3xl tracking-tight">Rs. {totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </section>
          ) : (
            <section className="bg-white rounded-[2.5rem] p-16 shadow-sm border border-slate-200 text-center flex flex-col items-center">
               <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300 mb-6 border border-slate-100">
                  <ShoppingCart size={40} />
               </div>
               <h3 className="text-2xl font-black text-slate-900 mb-2">Your cart is currently empty</h3>
               <p className="text-slate-500 font-medium mb-10 max-w-xs">Looks like you haven't added any campus essentials to your checkout yet.</p>
               <button 
                onClick={() => navigate("/shop")}
                className="px-10 py-4 bg-slate-900 hover:bg-brand-teal text-white font-black rounded-2xl transition-all shadow-xl shadow-slate-200 hover:-translate-y-1 flex items-center gap-3 group"
               >
                 <ExternalLink size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                 Back to Shop
               </button>
            </section>
          )}

          {/* Finalization Section */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200 group relative overflow-hidden">
               <div className="absolute top-0 left-0 w-2 h-full bg-slate-100 group-focus-within:bg-indigo-500 transition-colors"></div>
               <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                <MapPin size={14} className="text-indigo-500" /> Delivery Protocol
              </h3>
              <div className="relative">
                <MapPin className="absolute left-4 top-5 text-slate-300 w-5 h-5 pointer-events-none group-focus-within:text-indigo-500 transition-colors" />
                <textarea
                  {...register("address")}
                  rows={4}
                  className={`w-full pl-12 pr-4 py-4 bg-slate-50 border ${errors.address ? "border-red-300" : "border-slate-200"} rounded-2xl text-slate-800 font-bold placeholder:text-slate-400 placeholder:font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all resize-none shadow-inner`}
                  placeholder="Street name, hostel/room number, and specific instructions..."
                />
              </div>
              {errors.address && <p className="text-red-500 text-xs mt-2 ml-1 font-bold">{errors.address.message}</p>}
            </section>

            <button
              type="submit"
              disabled={submitting || cartItems.length === 0}
              className="w-full py-6 bg-slate-900 hover:bg-brand-teal text-white font-black rounded-[2.5rem] shadow-xl shadow-slate-200 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-4 text-lg group"
            >
              {submitting ? (
                <>
                  <Loader2 size={24} className="animate-spin" /> 
                  <span className="uppercase tracking-widest text-sm font-black">Authorizing...</span>
                </>
              ) : (
                <>
                  <ShoppingCart size={24} className="group-hover:rotate-12 transition-transform" /> 
                  Confirm Order — Rs. {totalAmount.toLocaleString('en-IN')}
                </>
              )}
            </button>
            <p className="text-center text-[10px] font-black uppercase tracking-widest text-slate-300">By placing this order you agree to campus exchange protocols.</p>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
