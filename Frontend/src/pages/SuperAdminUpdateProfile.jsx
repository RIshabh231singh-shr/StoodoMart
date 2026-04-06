import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate, useParams } from "react-router";
import axiosClient from "../utility/axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { User, Mail, ShieldAlert, ArrowLeft, ShieldCheck, Save, Loader2 } from "lucide-react";

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
      navigate("/superadmin/all-profiles");
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
            onClick={() => navigate("/superadmin/all-profiles")}
            className="flex items-center gap-2 text-slate-500 hover:text-brand-teal font-bold mb-8 transition-colors group"
          >
           <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Directory
          </button>

          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-200 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-amber-400"></div>
            
            <header className="mb-10">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 shadow-sm">
                  <ShieldCheck size={28} />
                </div>
                <h1 className="text-3xl font-black text-slate-900 leading-tight">Admin User Edit</h1>
              </div>
              <p className="text-slate-500 leading-relaxed font-medium">Modify system-wide user credentials and privilege levels.</p>
            </header>

            {apiError && (
              <div className="mb-8 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-center gap-3 font-bold">
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
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs ml-1 font-bold">{errors.email.message}</p>}
              </div>

              <div className="space-y-2 group">
                <label className="text-xs font-black uppercase tracking-widest text-amber-500 ml-1">Assigned Privilege Level</label>
                <div className="relative">
                  <ShieldAlert className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500 w-4 h-4 pointer-events-none" />
                  <select
                    {...register("role")}
                    className="w-full pl-11 pr-10 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 font-black uppercase tracking-widest text-xs focus:outline-none focus:ring-4 focus:ring-brand-teal/10 focus:border-brand-teal focus:bg-white transition-all appearance-none cursor-pointer"
                  >
                    <option value="User">Standard User</option>
                    <option value="Admin">Campus Admin</option>
                    <option value="SuperAdmin">System SuperAdmin</option>
                  </select>
                </div>
                {errors.role && <p className="text-red-500 text-xs ml-1 font-bold">{errors.role.message}</p>}
              </div>

              <div className="pt-8 flex flex-col sm:flex-row gap-4 items-center justify-between border-t border-slate-100">
                <p className="text-slate-400 text-xs font-medium italic">Administrative override in effect.</p>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-10 py-5 bg-slate-900 hover:bg-brand-teal text-white font-black rounded-2xl shadow-xl shadow-slate-200 transition-all hover:-translate-y-1 active:scale-95 flex justify-center items-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                       <Loader2 size={20} className="animate-spin" />
                       Saving Overrides...
                    </span>
                  ) : (
                    <>Save Overrides <Save size={20} className="group-hover:rotate-12 transition-transform" /></>
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
