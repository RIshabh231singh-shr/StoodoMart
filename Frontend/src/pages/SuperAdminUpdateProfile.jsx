import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate, Link, useParams } from "react-router";
import axiosClient from "../utility/axios";
import logo from "../assets/logo.png";
import { Loader2, User, Mail, ShieldAlert, ArrowLeft } from "lucide-react";

const updateSchemaBase = z.object({
  firstname: z.string().min(1, "Firstname is required"),
  lastname: z.string().optional(),
  email: z.string().email("Invalid email address"),
  role: z.enum(["User", "Admin", "SuperAdmin"]).optional(),
});

export default function SuperAdminUpdateProfile() {
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const navigate = useNavigate();
  const { id } = useParams();

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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosClient.get(`/person/supergetOneProfile/${id}`);
        const profileData = response.data.person;
        
        setValue("firstname", profileData.firstname || "");
        setValue("lastname", profileData.lastname || "");
        setValue("email", profileData.email || "");
        setValue("role", profileData.role || "User");
        setPageLoading(false);
      } catch (err) {
        console.error("Failed to load profile", err);
        setApiError("Failed to load profile data.");
        setPageLoading(false);
      }
    };
    
    if (id) {
        fetchUserData();
    }
  }, [id, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    setApiError("");

    try {
      const payload = { ...data };
      await axiosClient.put(`/person/updateprofile/${id}`, payload);
      
      // Send back to all profiles page
      navigate("/superadmin/all-profiles");
    } catch (err) {
      setApiError(err.response?.data?.message || "Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-slate-800 bg-gradient-to-br from-indigo-500/40 via-purple-500/40 to-slate-800/40 absolute inset-0 z-50 p-6">
         <div className="animate-pulse flex flex-col items-center gap-5 w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] p-8 shadow-2xl">
            {/* Shimmer for Title */}
            <div className="h-8 w-3/4 bg-white/20 rounded-xl mb-4"></div>
            {/* Shimmer for Inputs */}
            <div className="flex gap-4 w-full">
              <div className="h-12 w-1/2 bg-white/20 rounded-xl"></div>
              <div className="h-12 w-1/2 bg-white/20 rounded-xl"></div>
            </div>
            <div className="h-12 w-full bg-white/20 rounded-xl mb-2"></div>
            <div className="h-12 w-full bg-white/20 rounded-xl"></div>
            {/* Shimmer for Button */}
            <div className="h-14 w-full bg-indigo-500/30 rounded-xl mt-4"></div>
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-slate-800 bg-gradient-to-br from-indigo-500/40 via-purple-500/40 to-slate-800/40">
      
      {/* Navbar Integration */}
      <nav className="relative z-20 px-8 py-5 border-b border-white/20 flex items-center justify-between w-full bg-white/10 backdrop-blur-md">
        <div className="flex items-center gap-4">
            <Link to="/superadmin/all-profiles" className="bg-white/10 p-2 rounded-full text-white hover:bg-white/20 transition-all backdrop-blur-md">
                <ArrowLeft size={20} />
            </Link>
            <div className="flex items-center gap-3">
            <h1 className="text-xl font-extrabold tracking-tight text-white drop-shadow-md flex items-center gap-2">
                <img src={logo} alt="StoodoMart Logo" className="w-8 h-8 opacity-90" />
                Stoodo<span className="text-purple-400">Mart</span>
            </h1>
            <span className="text-slate-300 font-medium border-l border-white/30 pl-3">SuperAdmin Hub</span>
            </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex flex-col justify-center items-center p-6 mt-4">
        
        <div className="max-w-md w-full backdrop-blur-3xl overflow-hidden transform transition-all duration-300
        bg-white/10 border border-white/20 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)]
        ">
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold text-white mb-2">Edit User Profile</h2>
              <p className="text-slate-300">Update system privileges and user details</p>
            </div>

            {apiError && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/50 text-red-200 text-sm flex items-center gap-3">
                <ShieldAlert size={18} />
                <span>{apiError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 relative">
                  <label className="text-sm font-bold text-slate-300 ml-1">First Name <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                    <input
                      type="text"
                      {...register("firstname")}
                      className="w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                      placeholder="John"
                    />
                  </div>
                  {errors.firstname && <p className="text-red-400 text-xs ml-1 font-medium">{errors.firstname.message}</p>}
                </div>
                
                <div className="space-y-2 relative">
                  <label className="text-sm font-bold text-slate-300 ml-1">Last Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                    <input
                      type="text"
                      {...register("lastname")}
                      className="w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                      placeholder="Doe"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2 relative">
                <label className="text-sm font-bold text-slate-300 ml-1">Email <span className="text-red-400">*</span></label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                  <input
                    type="email"
                    {...register("email")}
                    className="w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                    placeholder="john@example.com"
                  />
                </div>
                {errors.email && <p className="text-red-400 text-xs ml-1 font-medium">{errors.email.message}</p>}
              </div>

              <div className="space-y-2 relative">
                <label className="text-sm font-bold text-purple-400 ml-1">System Role</label>
                <select
                  {...register("role")}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all appearance-none cursor-pointer"
                >
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                  <option value="SuperAdmin">SuperAdmin</option>
                </select>
                {errors.role && <p className="text-red-400 text-xs ml-1 font-medium">{errors.role.message}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black rounded-xl shadow-lg shadow-purple-500/20 transition-all active:scale-[0.98] mt-6 flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed border border-purple-400/30"
              >
                {loading ? (
                  <div className="flex gap-2 items-center">
                    <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-white animate-pulse delay-75"></div>
                    <div className="w-2 h-2 rounded-full bg-white animate-pulse delay-150"></div>
                  </div>
                ) : (
                  "Save User Changes"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
