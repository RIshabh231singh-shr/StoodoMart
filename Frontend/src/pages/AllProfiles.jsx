import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router";
import axiosClient from "../utility/axios";
import { Search, Edit2, Trash2, ShieldAlert, ChevronLeft, ChevronRight, User } from "lucide-react";
import logo from "../assets/logo.png";
import { useSelector } from "react-redux";

export default function AllProfiles() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { user } = useSelector((state) => state.auth);

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
    if (!window.confirm("Are you sure you want to delete this profile?")) return;
    try {
      await axiosClient.delete(`/person/superdeleteprofile/${id}`);
      fetchProfiles();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete profile");
    }
  };

  return (
    <div className="min-h-screen font-sans flex flex-col relative overflow-hidden bg-slate-800 bg-gradient-to-br from-indigo-500/40 via-purple-500/40 to-slate-800/40">
      
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
          <div className="relative w-72 group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-300 w-5 h-5 transition-colors group-focus-within:text-purple-400" />
            <input
              type="text"
              placeholder="Search by email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 bg-slate-900/40 border border-slate-500/50 rounded-xl text-sm focus:ring-2 focus:ring-purple-400/50 outline-none transition-all duration-300 text-white placeholder-slate-400 hover:border-slate-400 focus:border-purple-400"
            />
          </div>
          <Link
            to="/profile"
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold bg-white/10 text-white hover:bg-white/20 transition-all backdrop-blur-md active:scale-95 border border-white/10 shadow-lg"
          >
            <User size={18} />
            <span>Profile Info</span>
          </Link>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 p-8 max-w-7xl mx-auto w-full">
        {/* Header and Error */}
        <div className="mb-6 flex items-center justify-between">
            <h2 className="text-3xl font-extrabold text-white drop-shadow-md">User Directory</h2>
        </div>
        
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/50 text-red-100 flex items-center gap-3 backdrop-blur-sm">
            <ShieldAlert size={20} />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Loading / List */}
        {loading ? (
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-6 overflow-hidden">
             <div className="animate-pulse flex flex-col gap-6">
                 {/* Table Header Skeleton */}
                 <div className="flex gap-4 items-center w-full pb-4 border-b border-white/10">
                     <div className="h-6 bg-white/20 rounded w-1/4"></div>
                     <div className="h-6 bg-white/20 rounded w-1/4"></div>
                     <div className="h-6 bg-white/20 rounded w-1/6 ml-auto"></div>
                 </div>
                 {/* Rows Skeleton */}
                 {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="flex gap-6 items-center w-full py-2">
                       <div className="w-10 h-10 bg-white/20 rounded-full flex-shrink-0"></div>
                       <div className="h-5 bg-white/20 rounded w-1/4"></div>
                       <div className="h-5 bg-white/20 rounded w-1/4"></div>
                       <div className="h-8 bg-white/20 rounded-xl w-20 ml-auto mr-4"></div>
                    </div>
                 ))}
             </div>
          </div>
        ) : profiles.length === 0 ? (
          <div className="text-center py-20 text-slate-300 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
            <User size={56} className="mx-auto mb-4 opacity-50 text-indigo-300" />
            <p className="text-xl font-medium">No profiles found.</p>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden transform transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10 text-slate-300 text-sm">
                    <th className="py-5 px-6 font-bold uppercase tracking-wider">Name</th>
                    <th className="py-5 px-6 font-bold uppercase tracking-wider">Email</th>
                    <th className="py-5 px-6 font-bold uppercase tracking-wider">Role</th>
                    <th className="py-5 px-6 font-bold uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {profiles.map((profile) => (
                    <tr key={profile._id} className="group hover:bg-white/10 transition-all duration-300 ease-in-out cursor-default">
                      <td className="py-4 px-6 text-white">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-inner group-hover:from-indigo-400 group-hover:to-purple-500 flex items-center justify-center font-bold text-lg text-white transition-colors duration-300 border border-white/20">
                                {(profile.firstname?.[0] || 'U').toUpperCase()}
                            </div>
                            <span className="font-bold text-white tracking-wide text-lg drop-shadow-sm">
                              {profile.firstname} {profile.lastname}
                            </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-slate-200 font-medium tracking-wide">{profile.email}</td>
                      <td className="py-4 px-6">
                        <span className={`px-4 py-1.5 text-xs font-bold rounded-full shadow-sm transition-all duration-300 border backdrop-blur-md ${
                          profile.role === 'SuperAdmin' ? 'bg-purple-500/20 text-purple-200 border-purple-400/50' :
                          profile.role === 'Admin' ? 'bg-blue-500/20 text-blue-200 border-blue-400/50' :
                          'bg-slate-500/20 text-slate-200 border-slate-400/50'
                        }`}>
                          {profile.role || 'User'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-3 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                          <Link
                            to={`/superadmin/update-profile/${profile._id}`}
                            className="p-2 text-indigo-300 hover:text-white bg-indigo-500/10 hover:bg-indigo-500/40 border border-transparent hover:border-indigo-400/50 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
                            title="Update Profile"
                          >
                            <Edit2 size={20} />
                          </Link>
                          {user?._id !== profile._id && (
                            <button
                              onClick={() => handleDelete(profile._id)}
                              className="p-2 text-red-400 hover:text-white bg-red-500/10 hover:bg-red-500/60 border border-transparent hover:border-red-400/50 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
                              title="Delete Profile"
                            >
                              <Trash2 size={20} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="p-5 border-t border-white/10 flex items-center justify-between text-sm text-slate-200 bg-white/5">
                <div className="font-medium bg-white/10 px-4 py-1.5 rounded-full border border-white/10">
                  Page <span className="font-bold text-white">{page}</span> of <span className="font-bold text-white">{totalPages}</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-white disabled:opacity-30 disabled:hover:bg-white/10 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-2.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-white disabled:opacity-30 disabled:hover:bg-white/10 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
