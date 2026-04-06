import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useParams, useNavigate } from "react-router";
import axiosClient from "../utility/axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { 
  Package as LucidePackage, 
  Tag as LucideTag, 
  FileText as LucideFileText, 
  Image as LucideImage, 
  LayoutList as LucideLayoutList, 
  Hash as LucideHash, 
  CheckCircle as LucideCheckCircle, 
  AlertCircle as LucideAlertCircle, 
  ArrowLeft as LucideArrowLeft, 
  Save as LucideSave, 
  Loader2 as LucideLoader2 
} from "lucide-react";

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
      setTimeout(() => navigate('/my-products'), 1500);
    } catch (err) {
      setApiError(err.response?.data?.message || err.message || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900">
      <Header />

      <main className="flex-grow pt-32 pb-24 container mx-auto px-4 md:px-8 flex justify-center">
        
        <div className="w-full max-w-2xl">
          
          <button 
            onClick={() => navigate("/my-products")}
            className="flex items-center gap-2 text-slate-500 hover:text-brand-teal font-bold mb-8 transition-colors group"
          >
           <LucideArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Inventory
          </button>

          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-200 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-brand-teal"></div>
            
            <header className="mb-10">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                  <LucidePackage size={24} />
                </div>
                <h1 className="text-3xl font-black text-slate-900 leading-tight">Edit Product</h1>
              </div>
              <p className="text-slate-500 leading-relaxed font-medium">Update your product details and availability status.</p>
            </header>

            {apiError && (
              <div className="mb-8 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-center gap-3 font-bold">
                <LucideAlertCircle size={18} className="shrink-0" />
                <span>{apiError}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-8 p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 text-sm flex items-center gap-3 font-bold">
                <LucideCheckCircle size={18} className="shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {fetching ? (
                 <div className="flex flex-col items-center justify-center py-20 gap-4">
                     <LucideLoader2 size={40} className="animate-spin text-brand-teal" />
                     <p className="text-slate-400 font-bold animate-pulse uppercase tracking-widest text-xs">Fetching Details...</p>
                 </div>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                
                <div className="space-y-2 group">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1 group-focus-within:text-brand-teal transition-colors">Product Name *</label>
                    <div className="relative">
                      <LucidePackage size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-300 group-focus-within:text-brand-teal transition-colors" />
                      <input
                          type="text"
                          {...register("name")}
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-brand-teal/10 focus:border-brand-teal focus:bg-white transition-all font-bold"
                          placeholder="e.g. Wireless Headphones"
                      />
                    </div>
                    {errors.name && <p className="text-red-500 text-xs ml-1 font-bold">{errors.name.message}</p>}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2 group">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1 group-focus-within:text-brand-teal transition-colors">Selling Price (Rs.) *</label>
                      <div className="relative">
                          <LucideTag size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-300 group-focus-within:text-brand-teal transition-colors" />
                          <input
                          type="number"
                          step="0.01"
                          {...register("price")}
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-brand-teal/10 focus:border-brand-teal focus:bg-white transition-all font-bold"
                          placeholder="0.00"
                          />
                      </div>
                      {errors.price && <p className="text-red-500 text-xs ml-1 font-bold">{errors.price.message}</p>}
                    </div>

                    <div className="space-y-2 group">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1 group-focus-within:text-brand-teal transition-colors">Inventory Stock *</label>
                      <div className="relative">
                          <LucideHash size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-300 group-focus-within:text-brand-teal transition-colors" />
                          <input
                          type="number"
                          {...register("stock")}
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-brand-teal/10 focus:border-brand-teal focus:bg-white transition-all font-bold"
                          placeholder="e.g. 50"
                          />
                      </div>
                      {errors.stock && <p className="text-red-500 text-xs ml-1 font-bold">{errors.stock.message}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2 group">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1 group-focus-within:text-brand-teal transition-colors">Used For (Duration) *</label>
                      <div className="relative">
                          <LucideFileText size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-300 group-focus-within:text-brand-teal transition-colors" />
                          <input
                          type="text"
                          {...register("usedFor")}
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-brand-teal/10 focus:border-brand-teal focus:bg-white transition-all font-bold"
                          placeholder="e.g. 1 Semester"
                          />
                      </div>
                      {errors.usedFor && <p className="text-red-500 text-xs ml-1 font-bold">{errors.usedFor.message}</p>}
                    </div>

                    <div className="space-y-2 group">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1 group-focus-within:text-brand-teal transition-colors">Original Price (Rs.) *</label>
                      <div className="relative">
                          <LucideTag size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-300 group-focus-within:text-brand-teal transition-colors" />
                          <input
                          type="number"
                          step="0.01"
                          {...register("originalPrice")}
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-brand-teal/10 focus:border-brand-teal focus:bg-white transition-all font-bold"
                          placeholder="0.00"
                          />
                      </div>
                      {errors.originalPrice && <p className="text-red-500 text-xs ml-1 font-bold">{errors.originalPrice.message}</p>}
                    </div>
                </div>

                <div className="space-y-2 group">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1 group-focus-within:text-brand-teal transition-colors">Product Category *</label>
                    <div className="relative">
                    <LucideLayoutList size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-300 pointer-events-none group-focus-within:text-brand-teal transition-colors" />
                    <select
                        {...register("category")}
                        className="w-full pl-12 pr-10 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 font-bold focus:outline-none focus:ring-4 focus:ring-brand-teal/10 focus:border-brand-teal focus:bg-white transition-all appearance-none cursor-pointer"
                    >
                        <option value="" disabled>Select a category</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Instrument">Instrument</option>
                        <option value="Stationary">Stationary</option>
                        <option value="Other">Other</option>
                    </select>
                    </div>
                    {errors.category && <p className="text-red-500 text-xs ml-1 font-bold">{errors.category.message}</p>}
                </div>

                <div className="space-y-2 group">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1 group-focus-within:text-brand-teal transition-colors">Direct Image URL *</label>
                    <div className="relative">
                    <LucideImage size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-300 group-focus-within:text-brand-teal transition-colors" />
                    <input
                        type="url"
                        {...register("image")}
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-brand-teal/10 focus:border-brand-teal focus:bg-white transition-all font-bold"
                        placeholder="https://example.com/image.png"
                    />
                    </div>
                    {errors.image && <p className="text-red-500 text-xs ml-1 font-bold">{errors.image.message}</p>}
                    <p className="text-[10px] text-slate-400 font-medium ml-1">Tip: Use an image hosting service for the fastest results.</p>
                </div>

                <div className="space-y-2 group">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1 group-focus-within:text-brand-teal transition-colors">Description / Product Notes *</label>
                    <div className="relative">
                    <LucideFileText size={18} className="absolute left-4 top-4 text-slate-300 group-focus-within:text-brand-teal transition-colors" />
                    <textarea
                        {...register("description")}
                        rows="4"
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-brand-teal/10 focus:border-brand-teal focus:bg-white transition-all font-bold resize-none"
                        placeholder="Describe the condition, features, or accessories included..."
                    />
                    </div>
                    {errors.description && <p className="text-red-500 text-xs ml-1 font-bold">{errors.description.message}</p>}
                </div>

                <div className="pt-8 flex flex-col sm:flex-row gap-4 items-center justify-between border-t border-slate-100">
                    <p className="text-slate-400 text-xs font-medium italic">Changes will reflect immediately on the site.</p>
                    <button
                        type="submit"
                        disabled={loading || !isDirty}
                        className="w-full sm:w-auto px-10 py-5 bg-slate-900 hover:bg-brand-teal text-white font-black rounded-2xl shadow-xl shadow-slate-200 transition-all hover:-translate-y-1 active:scale-95 flex justify-center items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <LucideLoader2 size={20} className="animate-spin" />
                            <span>Updating...</span>
                        </span>
                    ) : (
                      <><LucideSave size={20} className="group-hover:rotate-12 transition-transform" /> Save Changes</>
                    )}
                    </button>
                </div>
                </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
