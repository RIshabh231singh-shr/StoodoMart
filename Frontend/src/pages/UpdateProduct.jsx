import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useParams, useNavigate } from "react-router";
import axiosClient from "../utility/axios";
import logo from "../assets/logo.png";
import { Loader2, Package, Tag, FileText, Image as ImageIcon, LayoutList, Hash, CheckCircle, AlertCircle, ChevronLeft } from "lucide-react";

// Matches backend product expectations
const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  price: z.coerce.number().min(0, "Price cannot be negative"),
  description: z.string().min(1, "Description is required"),
  image: z.string().url("Must be a valid image URL"),
  category: z.enum(["Electronics", "Instrument", "Stationary", "Other"], { errorMap: () => ({ message: "Please select a valid category" }) }),
  stock: z.coerce.number().min(0, "Stock cannot be negative").int("Stock must be a whole number"),
  usedFor: z.string().min(1, "Usage info is required"),
  originalPrice: z.coerce.number().min(0, "Original price cannot be negative"),
});

export default function UpdateProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      price: "",
      description: "",
      image: "",
      category: "",
      stock: "",
      usedFor: "",
      originalPrice: "",
    },
  });

  // Fetch the existing product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setFetching(true);
        const res = await axiosClient.get(`/product/getoneproduct/${id}`);
        const product = res.data.product;
        if (product) {
          // pre-fill the form with fetched data
          reset({
            name: product.name,
            price: product.price,
            description: product.description,
            image: product.image,
            category: product.category,
            stock: product.stock,
            usedFor: product.usedFor || "",
            originalPrice: product.originalPrice || "",
          });
        }
      } catch (err) {
        setApiError(err.response?.data?.message || "Failed to fetch product data. It may have been deleted.");
      } finally {
        setFetching(false);
      }
    };
    
    if (id) {
        fetchProduct();
    }
  }, [id, reset]);

  const onSubmit = async (data) => {
    if (!isDirty) {
        setSuccessMsg("No changes detected.");
        return;
    }
    
    setLoading(true);
    setApiError("");
    setSuccessMsg("");

    try {
      const response = await axiosClient.put(`/product/updateproduct/${id}`, data);
      setSuccessMsg(response.data.message || "Product updated successfully!");
      // Optionally redirect user back to My Products after a brief delay
      setTimeout(() => navigate('/my-products'), 1500);
    } catch (err) {
      setApiError(err.response?.data?.message || err.message || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-800 bg-gradient-to-br from-indigo-500/40 via-purple-500/40 to-slate-800/40 flex flex-col font-sans relative overflow-hidden">
        
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
            to="/my-products"
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold bg-white/10 text-white hover:bg-white/20 transition-all backdrop-blur-md active:scale-95 border border-white/10 shadow-lg"
          >
            <ChevronLeft size={18} />
            <span>Cancel</span>
          </Link>
        </div>
      </nav>

      {/* Main Form Content */}
      <main className="relative z-10 flex-grow flex justify-center items-start py-10 px-4 sm:px-6">
        <div className="w-full max-w-2xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden">
          
          <div className="px-8 py-6 border-b border-white/10 bg-white/5">
            <h1 className="text-2xl font-bold text-white mb-1 drop-shadow-md">Update Product</h1>
            <p className="text-sm text-slate-300">Modify the details below to update your product in the catalog.</p>
          </div>

          <div className="p-8">
            {apiError && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/50 text-red-100 text-sm flex items-center gap-3 backdrop-blur-sm">
                <AlertCircle size={18} className="shrink-0" />
                <span>{apiError}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-6 p-4 rounded-xl bg-green-500/20 border border-green-500/50 text-green-100 text-sm flex items-center gap-3 backdrop-blur-sm">
                <CheckCircle size={18} className="shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {fetching ? (
                 <div className="flex flex-col items-center justify-center py-12 gap-4">
                     <Loader2 size={40} className="animate-spin text-purple-400" />
                     <p className="text-indigo-200 font-medium animate-pulse">Loading product details...</p>
                 </div>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-200 ml-1">Product Name *</label>
                    <div className="relative">
                    <Package className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                    <input
                        type="text"
                        {...register("name")}
                        className={`w-full pl-11 pr-4 py-3 bg-white/10 border ${errors.name ? 'border-red-400 focus:border-red-400' : 'border-white/20 focus:border-indigo-400'} rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-sm`}
                        placeholder="e.g. Wireless Headphones"
                    />
                    </div>
                    {errors.name && <p className="text-red-400 text-xs ml-1 font-medium">{errors.name.message}</p>}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-200 ml-1">Price (Rs.) *</label>
                    <div className="relative">
                        <Tag className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                        <input
                        type="number"
                        step="0.01"
                        {...register("price")}
                        className={`w-full pl-11 pr-4 py-3 bg-white/10 border ${errors.price ? 'border-red-400 focus:border-red-400' : 'border-white/20 focus:border-indigo-400'} rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-sm`}
                        placeholder="0.00"
                        />
                    </div>
                    {errors.price && <p className="text-red-400 text-xs ml-1 font-medium">{errors.price.message}</p>}
                    </div>

                    <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-200 ml-1">Stock Quantity *</label>
                    <div className="relative">
                        <Hash className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                        <input
                        type="number"
                        {...register("stock")}
                        className={`w-full pl-11 pr-4 py-3 bg-white/10 border ${errors.stock ? 'border-red-400 focus:border-red-400' : 'border-white/20 focus:border-indigo-400'} rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-sm`}
                        placeholder="e.g. 50"
                        />
                    </div>
                    {errors.stock && <p className="text-red-400 text-xs ml-1 font-medium">{errors.stock.message}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-200 ml-1">Used For (Duration) *</label>
                    <div className="relative">
                        <FileText className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                        <input
                        type="text"
                        {...register("usedFor")}
                        className={`w-full pl-11 pr-4 py-3 bg-white/10 border ${errors.usedFor ? 'border-red-400 focus:border-red-400' : 'border-white/20 focus:border-indigo-400'} rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-sm`}
                        placeholder="e.g. 6 Months"
                        />
                    </div>
                    {errors.usedFor && <p className="text-red-400 text-xs ml-1 font-medium">{errors.usedFor.message}</p>}
                    </div>

                    <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-200 ml-1">Original Price (Rs.) *</label>
                    <div className="relative">
                        <Tag className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                        <input
                        type="number"
                        step="0.01"
                        {...register("originalPrice")}
                        className={`w-full pl-11 pr-4 py-3 bg-white/10 border ${errors.originalPrice ? 'border-red-400 focus:border-red-400' : 'border-white/20 focus:border-indigo-400'} rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-sm`}
                        placeholder="0.00"
                        />
                    </div>
                    {errors.originalPrice && <p className="text-red-400 text-xs ml-1 font-medium">{errors.originalPrice.message}</p>}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-200 ml-1">Category *</label>
                    <div className="relative">
                    <LayoutList className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                    <select
                        {...register("category")}
                        className={`w-full pl-11 pr-4 py-3 bg-white/10 border ${errors.category ? 'border-red-400 focus:border-red-400' : 'border-white/20 focus:border-indigo-400'} rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-sm appearance-none cursor-pointer [&>option]:bg-slate-800`}
                    >
                        <option value="" disabled>Select a category</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Instrument">Instrument</option>
                        <option value="Stationary">Stationary</option>
                        <option value="Other">Other</option>
                    </select>
                    </div>
                    {errors.category && <p className="text-red-400 text-xs ml-1 font-medium">{errors.category.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-200 ml-1">Image URL *</label>
                    <div className="relative">
                    <ImageIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                    <input
                        type="url"
                        {...register("image")}
                        className={`w-full pl-11 pr-4 py-3 bg-white/10 border ${errors.image ? 'border-red-400 focus:border-red-400' : 'border-white/20 focus:border-indigo-400'} rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-sm`}
                        placeholder="https://example.com/image.png"
                    />
                    </div>
                    {errors.image && <p className="text-red-400 text-xs ml-1 font-medium">{errors.image.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-200 ml-1">Description *</label>
                    <div className="relative">
                    <FileText className="absolute left-4 top-4 text-slate-400 w-5 h-5 pointer-events-none" />
                    <textarea
                        {...register("description")}
                        rows="4"
                        className={`w-full pl-11 pr-4 py-3 bg-white/10 border ${errors.description ? 'border-red-400 focus:border-red-400' : 'border-white/20 focus:border-indigo-400'} rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-sm resize-none`}
                        placeholder="Describe the product details..."
                    />
                    </div>
                    {errors.description && <p className="text-red-400 text-xs ml-1 font-medium">{errors.description.message}</p>}
                </div>

                <div className="pt-4 flex items-center justify-end border-t border-white/10 gap-4 mt-6">
                    <button
                        type="submit"
                        disabled={loading || !isDirty}
                        className="w-full sm:w-auto px-10 py-3.5 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold rounded-xl shadow-[0_10px_20px_rgba(99,102,241,0.3)] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 justify-center"
                    >
                    {loading ? (
                        <div className="flex items-center gap-2">
                            <Loader2 size={18} className="animate-spin" />
                            <span>Updating...</span>
                        </div>
                    ) : "Save Changes"}
                    </button>
                </div>
                </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
