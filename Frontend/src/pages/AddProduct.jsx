import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link } from "react-router";
import axiosClient from "../utility/axios";
import logo from "../assets/logo.png";
import { Loader2, Package, Tag, FileText, Image as ImageIcon, LayoutList, Hash, CheckCircle, AlertCircle } from "lucide-react";

// Matches backend product expectations
const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  price: z.coerce.number().min(0, "Price cannot be negative"),
  description: z.string().min(1, "Description is required"),
  image: z.string().url("Must be a valid image URL"),
  category: z.enum(["Electronics", "Instrument", "Stationary", "Other"], { errorMap: () => ({ message: "Please select a valid category" }) }),
  stock: z.coerce.number().min(0, "Stock cannot be negative").int("Stock must be a whole number"),
});

export default function AddProduct() {
  const [apiError, setApiError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      price: "",
      description: "",
      image: "",
      category: "",
      stock: "",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setApiError("");
    setSuccessMsg("");

    try {
      const response = await axiosClient.post("/product/createproduct", data);
      setSuccessMsg(response.data.message || "Product created successfully!");
      reset(); // clear form
    } catch (err) {
      setApiError(err.response?.data?.message || err.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 flex flex-col font-sans text-slate-800">
      {/* Simple Header */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center relative z-10 shadow-sm">
        <Link to="/" className="flex items-center gap-2 group decoration-transparent">
          <img src={logo} alt="StoodoMart Logo" className="w-8 h-auto" />
          <span className="text-xl font-extrabold tracking-tight text-slate-800">Stoodo<span className="text-indigo-600">Mart</span></span>
        </Link>
        <Link to="/profile" className="text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors">
          Back to Profile
        </Link>
      </nav>

      {/* Main Form Content */}
      <main className="flex-grow flex justify-center items-start py-10 px-4 sm:px-6">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
          
          <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50">
            <h1 className="text-2xl font-bold text-slate-800 mb-1">Add New Product</h1>
            <p className="text-sm text-slate-500">Fill out the details below to add a product to the catalog.</p>
          </div>

          <div className="p-8">
            {apiError && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-3">
                <AlertCircle size={18} className="shrink-0" />
                <span>{apiError}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm flex items-center gap-3">
                <CheckCircle size={18} className="shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Product Name *</label>
                <div className="relative">
                  <Package className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                  <input
                    type="text"
                    {...register("name")}
                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all shadow-sm"
                    placeholder="e.g. Wireless Headphones"
                  />
                </div>
                {errors.name && <p className="text-red-500 text-xs ml-1 font-medium">{errors.name.message}</p>}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Price (₹) *</label>
                  <div className="relative">
                    <Tag className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                    <input
                      type="number"
                      step="0.01"
                      {...register("price")}
                      className="w-full pl-11 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all shadow-sm"
                      placeholder="0.00"
                    />
                  </div>
                  {errors.price && <p className="text-red-500 text-xs ml-1 font-medium">{errors.price.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Stock Quantity *</label>
                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                    <input
                      type="number"
                      {...register("stock")}
                      className="w-full pl-11 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all shadow-sm"
                      placeholder="e.g. 50"
                    />
                  </div>
                  {errors.stock && <p className="text-red-500 text-xs ml-1 font-medium">{errors.stock.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Category *</label>
                <div className="relative">
                  <LayoutList className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                  <select
                    {...register("category")}
                    defaultValue=""
                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all shadow-sm appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Select a category</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Instrument">Instrument</option>
                    <option value="Stationary">Stationary</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                {errors.category && <p className="text-red-500 text-xs ml-1 font-medium">{errors.category.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Image URL *</label>
                <div className="relative">
                  <ImageIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                  <input
                    type="url"
                    {...register("image")}
                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all shadow-sm"
                    placeholder="https://example.com/image.png"
                  />
                </div>
                {errors.image && <p className="text-red-500 text-xs ml-1 font-medium">{errors.image.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Description *</label>
                <div className="relative">
                  <FileText className="absolute left-4 top-4 text-slate-400 w-5 h-5 pointer-events-none" />
                  <textarea
                    {...register("description")}
                    rows="4"
                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all shadow-sm resize-none"
                    placeholder="Describe the product details..."
                  />
                </div>
                {errors.description && <p className="text-red-500 text-xs ml-1 font-medium">{errors.description.message}</p>}
              </div>

              <div className="pt-4 flex items-center justify-end gap-4 border-t border-slate-100">
                <Link
                  to="/profile"
                  className="px-6 py-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold rounded-xl transition-all"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-200 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 min-w-[170px] justify-center"
                >
                  {loading ? (
                    <div className="flex gap-2 items-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse delay-75"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse delay-150"></div>
                      <span className="ml-1">Creating...</span>
                    </div>
                  ) : "Create Product"}
                </button>
              </div>

            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
