import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate, Link } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import axiosClient from "../utility/axios";
import { CheckAuthThunk } from "../Authslice";
import logo from "../assets/logo.png";
import { Loader2, User, Mail, ShieldAlert } from "lucide-react";

// Matches backend validation setup but makes password optional for updates
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
      // Clean up optional fields
      const payload = { ...data };
      // Only SuperAdmins can send role
      if (user?.role !== "SuperAdmin") delete payload.role;

      await axiosClient.put(`/person/updateprofile/${user._id}`, payload);
      
      // Update global redux state silently behind the scenes
      dispatch(CheckAuthThunk());
      
      // Send back to profile page
      navigate("/profile");
    } catch (err) {
      setApiError(err.response?.data?.message || "Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 absolute inset-0 z-50">
        <Loader2 size={48} className="animate-spin text-brand-teal" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-slate-800 bg-gradient-to-br from-indigo-500/40 via-purple-500/40 to-slate-800/40">
      
      {/* Navbar Integration */}
      <nav className="relative z-20 px-8 py-5 border-b border-white/20 flex items-center justify-between w-full bg-white/10 backdrop-blur-md">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md transition-all group-hover:bg-white/20">
            <img src={logo} alt="StoodoMart Logo" className="w-10 h-auto" />
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-white drop-shadow-md">
            Stoodo<span className="text-purple-400">Mart</span>
          </h1>
        </Link>
        <Link to="/profile" className="px-5 py-2 rounded-xl text-sm font-bold bg-white/10 text-white hover:bg-white/20 transition-colors backdrop-blur-md">
           Cancel
        </Link>
      </nav>

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex flex-col justify-center items-center p-6 mt-4
      ">
        
        <div className="max-w-md w-full backdrop-blur-3xl border border-white/20 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden transform transition-all duration-300
        bg-white/0.1 backdrop-blur-xl border border-white/40 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)]
        ">
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold text-white mb-2">Update Profile</h2>
              <p className="text-slate-300">Modify your account information</p>
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

              {/* Conditional Role Selection for SuperAdmin Only */}
              {user?.role === "SuperAdmin" && (
                <div className="space-y-2 relative">
                  <label className="text-sm font-bold text-purple-400 ml-1">Role (SuperAdmin Only)</label>
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
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black rounded-xl shadow-lg shadow-purple-500/20 transition-all active:scale-[0.98] mt-6 flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 size={24} className="animate-spin" />
                ) : (
                  "Publish Changes"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
