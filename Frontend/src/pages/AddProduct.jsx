import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link } from "react-router";
import axiosClient from "../utility/axios";
import logo from "../assets/logo.png";
import { Package, Tag, FileText, LayoutList, Hash, CheckCircle, AlertCircle, Upload, Image as ImageIcon } from "lucide-react";

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  price: z.coerce.number().min(0, "Price cannot be negative"),
  description: z.string().min(1, "Description is required"),
  category: z.enum(["Electronics", "Instrument", "Stationary", "Other"], { errorMap: () => ({ message: "Please select a valid category" }) }),
  stock: z.coerce.number().min(0, "Stock cannot be negative").int("Stock must be a whole number"),
  college: z.string().min(1, "Please select the campus where this product is available"),
});

export default function AddProduct() {
  const [apiError, setApiError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageError, setImageError] = useState("");

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
      // Build FormData — this sends the file as multipart
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("price", data.price);
      formData.append("description", data.description);
      formData.append("category", data.category);
      formData.append("stock", data.stock);
      formData.append("college", data.college);
      formData.append("image", imageFile);

      const response = await axiosClient.post("/product/createproduct", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccessMsg(response.data.message || "Product created successfully!");
      reset();
      setImageFile(null);
      setImagePreview(null);
    } catch (err) {
      setApiError(err.response?.data?.message || err.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 flex flex-col font-sans text-slate-800">
      {/* Header */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center relative z-10 shadow-sm">
        <Link to="/" className="flex items-center gap-2 group decoration-transparent">
          <img src={logo} alt="StoodoMart Logo" className="w-8 h-auto" />
          <span className="text-xl font-extrabold tracking-tight text-slate-800">Stoodo<span className="text-indigo-600">Mart</span></span>
        </Link>
        <Link to="/profile" className="text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors">
          Back to Profile
        </Link>
      </nav>

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
              
              {/* Product Name */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Product Name *</label>
                <div className="relative">
                  <Package className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                  <input type="text" {...register("name")}
                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all shadow-sm"
                    placeholder="e.g. Wireless Headphones" />
                </div>
                {errors.name && <p className="text-red-500 text-xs ml-1 font-medium">{errors.name.message}</p>}
              </div>
              
              {/* Price + Stock */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Price (Rs.) *</label>
                  <div className="relative">
                    <Tag className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                    <input type="number" step="0.01" {...register("price")}
                      className="w-full pl-11 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all shadow-sm"
                      placeholder="0.00" />
                  </div>
                  {errors.price && <p className="text-red-500 text-xs ml-1 font-medium">{errors.price.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Stock Quantity *</label>
                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                    <input type="number" {...register("stock")}
                      className="w-full pl-11 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all shadow-sm"
                      placeholder="e.g. 50" />
                  </div>
                  {errors.stock && <p className="text-red-500 text-xs ml-1 font-medium">{errors.stock.message}</p>}
                </div>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Category *</label>
                <div className="relative">
                  <LayoutList className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                  <select {...register("category")} defaultValue=""
                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all shadow-sm appearance-none cursor-pointer">
                    <option value="" disabled>Select a category</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Instrument">Instrument</option>
                    <option value="Stationary">Stationary</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                {errors.category && <p className="text-red-500 text-xs ml-1 font-medium">{errors.category.message}</p>}
              </div>

              {/* College / Campus */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Campus/College *</label>
                <div className="relative">
                  <LayoutList className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                  <select {...register("college")} defaultValue=""
                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all shadow-sm appearance-none cursor-pointer">
                    <option value="" disabled>Select College</option>
                    <option value="NIT Calicut">NIT Calicut</option>
                  </select>
                </div>
                {errors.college && <p className="text-red-500 text-xs ml-1 font-medium">{errors.college.message}</p>}
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Product Image *</label>
                <div className={`relative border-2 border-dashed rounded-xl transition-all ${imageError ? 'border-red-400 bg-red-50' : imagePreview ? 'border-indigo-400 bg-indigo-50/30' : 'border-slate-300 hover:border-indigo-400 bg-slate-50'}`}>
                  <input
                    type="file"
                    id="imageUpload"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  {imagePreview ? (
                    <div className="flex items-center gap-4 p-4">
                      <img src={imagePreview} alt="Preview" className="w-20 h-20 rounded-xl object-cover border border-slate-200 shadow-sm" />
                      <div>
                        <p className="text-sm font-semibold text-slate-700">{imageFile?.name}</p>
                        <p className="text-xs text-slate-400 mt-1">{(imageFile?.size / 1024).toFixed(1)} KB — <span className="text-indigo-500 font-medium">Click to change</span></p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 gap-2 text-slate-400">
                      <div className="bg-indigo-100 p-3 rounded-full">
                        <Upload size={24} className="text-indigo-500" />
                      </div>
                      <p className="text-sm font-medium text-slate-600">Click to upload or drag & drop</p>
                      <p className="text-xs text-slate-400">PNG, JPG, WEBP up to 5MB</p>
                    </div>
                  )}
                </div>
                {imageError && <p className="text-red-500 text-xs ml-1 font-medium">{imageError}</p>}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Description *</label>
                <div className="relative">
                  <FileText className="absolute left-4 top-4 text-slate-400 w-5 h-5 pointer-events-none" />
                  <textarea {...register("description")} rows="4"
                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all shadow-sm resize-none"
                    placeholder="Describe the product details..." />
                </div>
                {errors.description && <p className="text-red-500 text-xs ml-1 font-medium">{errors.description.message}</p>}
              </div>

              {/* Buttons */}
              <div className="pt-4 flex items-center justify-end gap-4 border-t border-slate-100">
                <Link to="/profile"
                  className="px-6 py-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold rounded-xl transition-all">
                  Cancel
                </Link>
                <button type="submit" disabled={loading}
                  className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-200 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 min-w-[170px] justify-center">
                  {loading ? (
                    <div className="flex gap-2 items-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse delay-75"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse delay-150"></div>
                      <span className="ml-1">Uploading...</span>
                    </div>
                  ) : (
                    <><ImageIcon size={18} />Create Product</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
