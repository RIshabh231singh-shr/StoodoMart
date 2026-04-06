import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router";
import axiosClient from "../utility/axios";
import { Search, Edit2, Trash2, ShieldAlert, ChevronLeft, ChevronRight, User, ArrowLeft, Users, ShieldCheck } from "lucide-react";
import { useSelector } from "react-redux";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function AllProfiles() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { user: currentUser } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axiosClient.get("/person/supergetAllProfile", {
        params: { page, limit: 10, email: searchTerm },
      });
      setProfiles(res.data.person || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      if (err.response?.status === 404) {
          setProfiles([]);
          setTotalPages(1);
      } else {
          setError(err.response?.data?.message || "Failed to fetch profiles");
          setProfiles([]);
      }
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProfiles();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, page, fetchProfiles]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this profile? This action is permanent.")) return;
    try {
      await axiosClient.delete(`/person/superdeleteprofile/${id}`);
      fetchProfiles();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete profile");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900">
      <Header />

      <main className="flex-grow pt-32 pb-24 container mx-auto px-4 md:px-8 max-w-7xl">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="flex-grow">
              <button 
                onClick={() => navigate("/profile")}
                className="flex items-center gap-2 text-slate-500 hover:text-brand-teal font-bold mb-4 transition-colors group"
              >
               <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Dashboard
              </button>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-tight mb-2 flex items-center gap-4">
                <Users size={36} className="text-brand-teal" /> User Directory
              </h1>
              <p className="text-slate-500 font-medium">Manage and audit system-wide user credentials and access levels.</p>
            </div>

            {/* In-page Search */}
            <div className="w-full md:w-80 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-teal transition-colors" size={18} />
              <input
                type="text"
                placeholder="Search by email..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-slate-800 font-bold placeholder:text-slate-400 placeholder:font-medium focus:outline-none focus:ring-4 focus:ring-brand-teal/10 focus:border-brand-teal shadow-sm transition-all"
              />
            </div>
        </div>

        {error && (
          <div className="mb-8 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-center gap-3 font-bold">
            <ShieldAlert size={18} className="shrink-0" />{error}
          </div>
        )}

        {/* Directory Table Container */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden relative min-h-[500px]">
          <div className="absolute top-0 left-0 w-full h-1 bg-brand-teal"></div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 uppercase tracking-widest text-[10px] font-black">
                  <th className="py-6 px-10">Identity</th>
                  <th className="py-6 px-6">Email Address</th>
                  <th className="py-6 px-6">System Role</th>
                  <th className="py-6 px-10 text-right">Administrative Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse border-b border-slate-50">
                      <td className="py-6 px-10">
                        <div className="flex gap-4 items-center">
                          <div className="w-12 h-12 bg-slate-100 rounded-full" />
                          <div className="h-4 bg-slate-100 rounded w-32" />
                        </div>
                      </td>
                      <td className="py-6 px-6"><div className="h-4 bg-slate-100 rounded w-48" /></td>
                      <td className="py-6 px-6"><div className="h-6 bg-slate-100 rounded-full w-24" /></td>
                      <td className="py-6 px-10 text-right"><div className="h-8 bg-slate-100 rounded-xl w-24 ml-auto" /></td>
                    </tr>
                  ))
                ) : profiles.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-32 text-center">
                      <div className="flex flex-col items-center gap-4 text-slate-300">
                        <div className="w-20 h-20 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-2">
                           <User size={40} />
                        </div>
                        <p className="font-black text-slate-900 text-xl tracking-tight">User not found</p>
                        <p className="text-slate-500 max-w-xs mx-auto">No profiles match the email "{searchTerm}". Try a different search term.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  profiles.map((profile) => (
                    <tr key={profile._id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="py-6 px-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full border-2 border-white shadow-sm flex items-center justify-center font-black text-lg text-white bg-gradient-to-br from-brand-teal via-emerald-400 to-brand-green group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                                {profile.avatar ? (
                                  <img src={profile.avatar} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  (profile.firstname?.[0] || 'U').toUpperCase()
                                )}
                            </div>
                            <span className="font-black text-slate-900 tracking-tight text-base">
                              {profile.firstname} {profile.lastname}
                            </span>
                        </div>
                      </td>
                      <td className="py-6 px-6 text-slate-500 font-bold text-sm tracking-tight">{profile.email}</td>
                      <td className="py-6 px-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                          profile.role === 'SuperAdmin' ? 'bg-amber-50 text-amber-600 border-amber-100 shadow-sm shadow-amber-100' :
                          profile.role === 'Admin' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                          'bg-slate-50 text-slate-500 border-slate-100'
                        }`}>
                          {profile.role === 'SuperAdmin' && <ShieldCheck size={12} />}
                          {profile.role || 'User'}
                        </span>
                      </td>
                      <td className="py-6 px-10 text-right">
                        <div className="flex items-center justify-end gap-3 opacity-30 group-hover:opacity-100 transition-opacity">
                          <Link
                            to={`/superadmin/update-profile/${profile._id}`}
                            className="p-3 bg-white hover:bg-brand-teal text-slate-400 hover:text-slate-900 border border-slate-100 hover:border-brand-teal rounded-xl transition-all shadow-sm hover:shadow-md active:scale-95"
                            title="Quick Edit"
                          >
                            <Edit2 size={16} />
                          </Link>
                          {currentUser?._id !== profile._id && (
                            <button
                              onClick={() => handleDelete(profile._id)}
                              className="p-3 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-500 border border-slate-100 hover:border-rose-100 rounded-xl transition-all shadow-sm hover:shadow-md active:scale-95"
                              title="Delete Profile"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {!loading && totalPages > 1 && (
            <footer className="p-8 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Page <span className="text-slate-900">{page}</span> of {totalPages}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-30 transition-all shadow-sm active:scale-95"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-30 transition-all shadow-sm active:scale-95"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </footer>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
