import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate, Link } from "react-router";
import axiosClient from "../utility/axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Package, Tag, FileText, LayoutList, Hash, CheckCircle, AlertCircle, Upload, Image as ImageIcon, ArrowLeft, ArrowRight } from "lucide-react";

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  price: z.coerce.number().min(0, "Price cannot be negative"),
  description: z.string().min(1, "Description is required"),
  category: z.enum(["Electronics", "Instrument", "Stationary", "Other"], { errorMap: () => ({ message: "Please select a valid category" }) }),
  stock: z.coerce.number().min(0, "Stock cannot be negative").int("Stock must be a whole number"),
  college: z.string().min(1, "Please select the campus where this product is available"),
  usedFor: z.string().min(1, "Please mention how long you have used this product"),
  originalPrice: z.coerce.number().min(0, "Original price cannot be negative"),
});

export default function AddProduct() {
  const [apiError, setApiError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageError, setImageError] = useState("");

  const navigate = useNavigate();

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
      category: "",
      stock: "",
      college: "",
      usedFor: "",
      originalPrice: "",
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageError("");
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setImageError("Only image files are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setImageError("Image must be under 5MB.");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const onSubmit = async (data) => {
    if (!imageFile) {
      setImageError("Product image is required.");
      return;
    }

    setLoading(true);
    setApiError("");
    setSuccessMsg("");

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("price", data.price);
      formData.append("description", data.description);
      formData.append("category", data.category);
      formData.append("stock", data.stock);
      formData.append("college", data.college);
      formData.append("usedFor", data.usedFor);
      formData.append("originalPrice", data.originalPrice);
      formData.append("image", imageFile);

      const response = await axiosClient.post("/product/createproduct", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccessMsg(response.data.message || "Product created successfully!");
      reset();
      setImageFile(null);
      setImagePreview(null);
      
      // Optionally redirect to My Products after success
      setTimeout(() => navigate("/my-products"), 2000);
    } catch (err) {
      setApiError(err.response?.data?.message || err.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900">
      <Header />

      <main className="flex-grow pt-32 pb-24 container mx-auto px-4 md:px-8 flex justify-center">
        
        <div className="w-full max-w-3xl">
          
          <div className="flex items-center justify-between mb-8">
            <button 
              onClick={() => navigate("/profile")}
              className="flex items-center gap-2 text-slate-500 hover:text-brand-teal font-bold transition-colors group"
            >
             <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back
            </button>
            <Link 
              to="/my-products"
              className="flex items-center gap-2 text-brand-teal hover:text-brand-green font-bold transition-colors group"
            >
              My Inventory <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-teal via-brand-green to-emerald-400"></div>
            
            <header className="px-8 md:px-12 pt-12 pb-8 border-b border-slate-100">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                  <Package size={24} />
                </div>
                <h1 className="text-3xl font-black text-slate-900 leading-tight">Add New Product</h1>
              </div>
              <p className="text-slate-500 leading-relaxed font-medium">List a new item on the StoodoMart campus marketplace.</p>
            </header>

            <div className="p-8 md:p-12">
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

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                
                {/* Visual Image Upload Area */}
                <div className="space-y-2 group">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1 group-focus-within:text-brand-teal transition-colors">Product Image</label>
                  <div className={`relative border-2 border-dashed rounded-3xl transition-all duration-300 min-h-[200px] flex flex-col items-center justify-center p-6 ${imageError ? 'border-red-400 bg-red-50' : imagePreview ? 'border-brand-teal bg-brand-teal/5' : 'border-slate-200 hover:border-brand-teal bg-slate-50'}`}>
                    <input
                      type="file"
                      id="imageUpload"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    {imagePreview ? (
                      <div className="flex flex-col items-center gap-4 text-center">
                        <img src={imagePreview} alt="Preview" className="w-40 h-40 rounded-2xl object-cover shadow-lg border-2 border-white" />
                        <div>
                          <p className="text-sm font-black text-slate-800">{imageFile?.name}</p>
                          <p className="text-[10px] text-brand-teal font-black uppercase tracking-wider mt-1">Tap to change image</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-3 text-slate-400">
                        <div className="w-16 h-16 rounded-3xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-brand-teal">
                          <Upload size={32} />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-bold text-slate-700">Click or drag & drop</p>
                          <p className="text-xs font-medium">PNG, JPG, WEBP (Max 5MB)</p>
                        </div>
                      </div>
                    )}
                  </div>
                  {imageError && <p className="text-red-500 text-xs ml-1 font-bold">{imageError}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Product Name */}
                  <div className="md:col-span-2 space-y-2 group">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1 group-focus-within:text-brand-teal transition-colors">Product Name *</label>
                    <div className="relative">
                      <Package size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-300 group-focus-within:text-brand-teal transition-colors" />
                      <input type="text" {...register("name")}
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-brand-teal/10 focus:border-brand-teal focus:bg-white transition-all font-bold"
                        placeholder="e.g. Mechanical Engineering Textbooks" />
                    </div>
                    {errors.name && <p className="text-red-500 text-xs ml-1 font-bold">{errors.name.message}</p>}
                  </div>
                  
                  {/* Price */}
                  <div className="space-y-2 group">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1 group-focus-within:text-brand-teal transition-colors">Selling Price (Rs.) *</label>
                    <div className="relative">
                      <Tag size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-300 group-focus-within:text-brand-teal transition-colors" />
                      <input type="number" step="0.01" {...register("price")}
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-brand-teal/10 focus:border-brand-teal focus:bg-white transition-all font-bold"
                        placeholder="0.00" />
                    </div>
                    {errors.price && <p className="text-red-500 text-xs ml-1 font-bold">{errors.price.message}</p>}
                  </div>

                  {/* Stock */}
                  <div className="space-y-2 group">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1 group-focus-within:text-brand-teal transition-colors">Quantity Available *</label>
                    <div className="relative">
                      <Hash size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-300 group-focus-within:text-brand-teal transition-colors" />
                      <input type="number" {...register("stock")}
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-brand-teal/10 focus:border-brand-teal focus:bg-white transition-all font-bold"
                        placeholder="e.g. 1" />
                    </div>
                    {errors.stock && <p className="text-red-500 text-xs ml-1 font-bold">{errors.stock.message}</p>}
                  </div>

                  {/* Used For */}
                  <div className="space-y-2 group">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1 group-focus-within:text-brand-teal transition-colors">Used For (Duration) *</label>
                    <div className="relative">
                      <FileText size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-300 group-focus-within:text-brand-teal transition-colors" />
                      <input type="text" {...register("usedFor")}
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-brand-teal/10 focus:border-brand-teal focus:bg-white transition-all font-bold"
                        placeholder="e.g. 1 Semester" />
                    </div>
                    {errors.usedFor && <p className="text-red-500 text-xs ml-1 font-bold">{errors.usedFor.message}</p>}
                  </div>

                  {/* Original Price */}
                  <div className="space-y-2 group">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1 group-focus-within:text-brand-teal transition-colors">Original Build/Buy Price *</label>
                    <div className="relative">
                      <Tag size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-300 group-focus-within:text-brand-teal transition-colors" />
                      <input type="number" step="0.01" {...register("originalPrice")}
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-brand-teal/10 focus:border-brand-teal focus:bg-white transition-all font-bold"
                        placeholder="What you originally paid" />
                    </div>
                    {errors.originalPrice && <p className="text-red-500 text-xs ml-1 font-bold">{errors.originalPrice.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Category */}
                  <div className="space-y-2 group">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1 group-focus-within:text-brand-teal transition-colors">Category *</label>
                    <div className="relative">
                      <LayoutList size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-300 pointer-events-none group-focus-within:text-brand-teal transition-colors" />
                      <select {...register("category")} defaultValue=""
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 font-bold focus:outline-none focus:ring-4 focus:ring-brand-teal/10 focus:border-brand-teal focus:bg-white transition-all appearance-none cursor-pointer">
                        <option value="" disabled>Select a category</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Instrument">Instrument</option>
                        <option value="Stationary">Stationary</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    {errors.category && <p className="text-red-500 text-xs ml-1 font-bold">{errors.category.message}</p>}
                  </div>

                  {/* College */}
                  <div className="space-y-2 group">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1 group-focus-within:text-brand-teal transition-colors">Available at Campus *</label>
                    <div className="relative">
                      <LayoutList size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-300 pointer-events-none group-focus-within:text-brand-teal transition-colors" />
                      <select {...register("college")} defaultValue=""
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 font-bold focus:outline-none focus:ring-4 focus:ring-brand-teal/10 focus:border-brand-teal focus:bg-white transition-all appearance-none cursor-pointer">
                        <option value="" disabled>Select College</option>
                        <option value="NIT Calicut">NIT Calicut</option>
                      </select>
                    </div>
                    {errors.college && <p className="text-red-500 text-xs ml-1 font-bold">{errors.college.message}</p>}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2 group">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1 group-focus-within:text-brand-teal transition-colors">Description / Item Condition *</label>
                  <div className="relative">
                    <FileText size={18} className="absolute left-4 top-4 text-slate-300 group-focus-within:text-brand-teal transition-colors" />
                    <textarea {...register("description")} rows="4"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-brand-teal/10 focus:border-brand-teal focus:bg-white transition-all font-bold resize-none"
                      placeholder="Describe the product details, condition, and any accessories included..." />
                  </div>
                  {errors.description && <p className="text-red-500 text-xs ml-1 font-bold">{errors.description.message}</p>}
                </div>

                <div className="pt-8 flex flex-col sm:flex-row gap-4 items-center justify-between border-t border-slate-100">
                  <p className="text-slate-400 text-xs font-medium italic">Your product will be live instantly upon approval.</p>
                  <button type="submit" disabled={loading}
                    className="w-full sm:w-auto px-10 py-5 bg-slate-900 hover:bg-brand-teal text-white font-black rounded-2xl shadow-xl shadow-slate-200 transition-all hover:-translate-y-1 active:scale-95 flex justify-center items-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group">
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                        <div className="w-2 h-2 rounded-full bg-white animate-pulse delay-75"></div>
                        <div className="w-2 h-2 rounded-full bg-white animate-pulse delay-150"></div>
                        Uploading...
                      </span>
                    ) : (
                      <><ImageIcon size={20} className="group-hover:rotate-12 transition-transform" /> List Product</>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
