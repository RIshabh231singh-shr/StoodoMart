import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import axiosClient from "../utility/axios";
import { CheckAuthThunk } from "../Authslice";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { User, Mail, ShieldAlert, Upload, Image as ImageIcon, ArrowLeft } from "lucide-react";

// Matches backend validation setup
const updateSchemaBase = z.object({
  firstname: z.string().min(1, "Firstname is required"),
  lastname: z.string().optional(),
  email: z.string().email("Invalid email address"),
  role: z.enum(["User", "Admin", "SuperAdmin"]).optional(),
});

export default function UpdateProfile() {
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [currentAvatar, setCurrentAvatar] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(updateSchemaBase),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      role: "User",
    },
  });

  // Fetch full user data on mount to fill in form
  useEffect(() => {
    const fetchUserData = async () => {
      if (!isAuthenticated || !user) {
        navigate("/login");
        return;
      }
      try {
        const response = await axiosClient.get(`/person/getOneProfile/${user._id}`);
        const profileData = response.data.person;
        
        setValue("firstname", profileData.firstname || "");
        setValue("lastname", profileData.lastname || "");
        setValue("email", profileData.email || "");
        setValue("role", profileData.role || "User");
        setCurrentAvatar(profileData.avatar || null);
        setPageLoading(false);
      } catch (err) {
        console.error("Failed to load profile", err);
        setApiError("Failed to load profile data.");
        setPageLoading(false);
      }
    };
    
    fetchUserData();
  }, [user, isAuthenticated, navigate, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    setApiError("");

    try {
      const formData = new FormData();
      formData.append("firstname", data.firstname);
      formData.append("lastname", data.lastname || "");
      formData.append("email", data.email);
      if (user?.role === "SuperAdmin" && data.role) {
        formData.append("role", data.role);
      }
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      await axiosClient.put(`/person/updateprofile/${user._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      dispatch(CheckAuthThunk());
      navigate("/profile");
    } catch (err) {
      setApiError(err.response?.data?.message || "Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
        <Header />
        <main className="flex-grow flex items-center justify-center pt-32 pb-20">
          <div className="animate-pulse flex flex-col items-center gap-5 w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <div className="h-8 w-3/4 bg-slate-100 rounded-xl mb-4"></div>
            <div className="flex gap-4 w-full">
              <div className="h-12 w-1/2 bg-slate-100 rounded-xl"></div>
              <div className="h-12 w-1/2 bg-slate-100 rounded-xl"></div>
            </div>
            <div className="h-12 w-full bg-slate-100 rounded-xl mb-2"></div>
            <div className="h-14 w-full bg-slate-200 rounded-xl mt-4"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900">
      <Header />

      <main className="flex-grow pt-32 pb-24 container mx-auto px-4 md:px-8 flex justify-center">
        
        <div className="w-full max-w-2xl">
          
          <button 
            onClick={() => navigate("/profile")}
            className="flex items-center gap-2 text-slate-500 hover:text-brand-teal font-bold mb-8 transition-colors group"
          >
           <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Profile
          </button>

          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-200 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-teal to-brand-green"></div>
            
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center mb-12">
              {/* Avatar Preview & Upload */}
              <div className="relative group shrink-0">
                <div className="w-32 h-32 rounded-full border-4 border-slate-50 overflow-hidden shadow-xl bg-slate-100">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="New avatar" className="w-full h-full object-cover" />
                  ) : currentAvatar ? (
                    <img src={currentAvatar} alt="Current avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-brand-teal to-brand-green flex items-center justify-center text-white text-4xl font-black">
                      {user?.firstname?.charAt(0).toUpperCase() || "?"}
                    </div>
                  )}
                </div>
                <label htmlFor="avatarInput" className="absolute bottom-0 right-0 w-10 h-10 bg-slate-900 hover:bg-brand-teal text-white rounded-full flex items-center justify-center cursor-pointer border-4 border-white shadow-lg transition-all transform hover:scale-110 active:scale-95">
                  <Upload size={18} />
                  <input
                    id="avatarInput"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setAvatarFile(file);
                        setAvatarPreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                </label>
              </div>

              <div className="flex-grow">
                <h1 className="text-3xl font-black text-slate-900 mb-2 leading-tight">Update Profile</h1>
                <p className="text-slate-500 leading-relaxed font-medium">
                  {avatarFile ? "Looks great! Ready to save?" : "Personalize your presence on the campus marketplace."}
                </p>
              </div>
            </div>

            {apiError && (
              <div className="mb-8 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-center gap-3 font-medium">
                <ShieldAlert size={18} className="shrink-0" />
                <span>{apiError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 group">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1 group-focus-within:text-brand-teal transition-colors">First Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-300 w-5 h-5 pointer-events-none group-focus-within:text-brand-teal transition-colors" />
                    <input
                      type="text"
                      {...register("firstname")}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-brand-teal/10 focus:border-brand-teal focus:bg-white transition-all font-bold"
                      placeholder="e.g. Rahul"
                    />
                  </div>
                  {errors.firstname && <p className="text-red-500 text-xs ml-1 font-bold">{errors.firstname.message}</p>}
                </div>
                
                <div className="space-y-2 group">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1 group-focus-within:text-brand-teal transition-colors">Last Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-300 w-5 h-5 pointer-events-none group-focus-within:text-brand-teal transition-colors" />
                    <input
                      type="text"
                      {...register("lastname")}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-brand-teal/10 focus:border-brand-teal focus:bg-white transition-all font-bold"
                      placeholder="e.g. Kumar"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2 group">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1 group-focus-within:text-brand-teal transition-colors">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-300 w-5 h-5 pointer-events-none group-focus-within:text-brand-teal transition-colors" />
                  <input
                    type="email"
                    {...register("email")}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-brand-teal/10 focus:border-brand-teal focus:bg-white transition-all font-bold"
                    placeholder="name@nitc.ac.in"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs ml-1 font-bold">{errors.email.message}</p>}
              </div>

              {/* Conditional Role Selection for SuperAdmin Only */}
              {user?.role === "SuperAdmin" && (
                <div className="space-y-2 group">
                  <label className="text-xs font-black uppercase tracking-widest text-brand-teal ml-1">Platform Role</label>
                  <select
                    {...register("role")}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 font-bold focus:outline-none focus:ring-4 focus:ring-brand-teal/10 focus:border-brand-teal focus:bg-white transition-all appearance-none cursor-pointer"
                  >
                    <option value="User">Standard User</option>
                    <option value="Admin">Campus Admin</option>
                    <option value="SuperAdmin">System SuperAdmin</option>
                  </select>
                  {errors.role && <p className="text-red-500 text-xs ml-1 font-bold">{errors.role.message}</p>}
                </div>
              )}

              <div className="pt-4 flex flex-col sm:flex-row gap-4 items-center justify-between border-t border-slate-100 mt-10">
                <p className="text-slate-400 text-xs font-medium">Fields marked with <span className="text-red-400">*</span> are mandatory</p>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-10 py-5 bg-slate-900 hover:bg-brand-teal text-white font-black rounded-2xl shadow-xl shadow-slate-200 transition-all hover:-translate-y-1 active:scale-95 flex justify-center items-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                       <div className="w-2 h-2 rounded-full bg-white animate-pulse delay-75"></div>
                       <div className="w-2 h-2 rounded-full bg-white animate-pulse delay-150"></div>
                       Saving...
                    </span>
                  ) : (
                    <>Save Changes <ImageIcon size={20} className="group-hover:rotate-12 transition-transform" /></>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
