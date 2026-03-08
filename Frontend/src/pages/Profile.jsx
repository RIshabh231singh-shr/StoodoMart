import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { Link } from 'react-router';
import axiosClient from '../utility/axios';
import { LogoutUserThunk } from '../Authslice';
import logo from '../assets/logo.png';

export default function Profile() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!user || !user._id) {
            navigate('/login');
            return;
        }
        const response = await axiosClient.get(`/person/getOneProfile/${user._id}`);
        setProfileData(response.data.person);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user, navigate]);

  const handleDeleteProfile = async () => {
    if (window.confirm("Are you sure you want to delete your profile? This action cannot be undone.")) {
      try {
        await axiosClient.delete(`/person/deleteprofile/${user._id}`);
        await dispatch(LogoutUserThunk());
        navigate("/");
      } catch (err) {
        alert("Error deleting profile: " + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleUpdateProfile = () => {
    navigate('/update-profile');
  };

  if (loading) return (
    <div className="flex flex-col min-h-screen bg-slate-900 bg-gradient-to-br from-indigo-900/40 via-purple-900/40 to-slate-900 font-sans relative overflow-hidden">
      <main className="flex-grow flex items-center justify-center relative z-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-white border-solid shadow-[0_0_15px_rgba(255,255,255,0.5)]"></div>
      </main>
    </div>
  );

  if (error || !profileData) return (
    <div className="flex flex-col min-h-screen bg-slate-900 bg-gradient-to-br from-indigo-900/40 via-purple-900/40 to-slate-900 font-sans relative overflow-hidden">
      <main className="flex-grow flex flex-col items-center justify-center text-center px-4 relative z-10">
        <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl max-w-md w-full border border-red-200 shadow-2xl">
            <h2 className="text-2xl font-bold text-red-600 mb-2">Failed to load profile</h2>
            <p className="text-slate-600 mb-6">{error}</p>
            <button onClick={() => navigate("/")} className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-md">Go Home</button>
        </div>
      </main>
    </div>
  );

  const firstLetter = profileData.firstname ? profileData.firstname.charAt(0).toUpperCase() : '?';

  return (
    <div className="flex flex-col min-h-screen bg-slate-800 bg-gradient-to-br from-indigo-500/40 via-purple-500/40 to-slate-800/40 font-sans relative overflow-hidden">
      
      {/* Profile Navbar */}
      <nav className="relative z-20 bg-white/10 backdrop-blur-md border-b border-white/20 px-6 py-4 flex justify-between items-center shadow-sm">
        <Link to="/" className="flex items-center gap-2 group decoration-transparent">
          <img src={logo} alt="StoodoMart Logo" className="w-10 h-auto drop-shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3" />
          <span className="text-2xl font-extrabold text-white tracking-tight drop-shadow-md">Stoodo<span className="text-purple-400">Mart</span></span>
        </Link>
        <div className="flex gap-4">
          {(profileData.role === 'Admin' || profileData.role === 'SuperAdmin') && (
            <button 
              onClick={() => navigate('/add-product')}
              className="px-5 py-2 bg-white/20 hover:bg-white/30 text-white font-bold rounded-xl transition-all border border-white/30 shadow-[0_4px_15px_rgba(0,0,0,0.1)] hover:-translate-y-0.5"
            >
              Add Product
            </button>
          )}
          {profileData.role === 'SuperAdmin' && (
            <button 
              onClick={() => navigate('/all-profiles')}
              className="px-5 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:to-indigo-500 text-white font-extrabold rounded-xl transition-all shadow-[0_4px_15px_rgba(99,102,241,0.3)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.4)] hover:-translate-y-0.5 border border-indigo-400/50"
            >
              Get All Profiles
            </button>
          )}
        </div>
      </nav>

      <main className="flex-grow py-6 px-4 sm:px-6 lg:px-8 flex justify-center items-center relative z-10 animate-slide-up">
        
        {/* Bright Card Container */}
        <div className="max-w-lg w-full bg-white/95 backdrop-blur-xl border border-white/40 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] overflow-hidden transform transition-all duration-300 hover:shadow-[0_25px_60px_rgba(0,0,0,0.3)]">
          
          {/* Cover Header */}
          <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 h-28 relative">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30"></div>
             <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/60 to-transparent"></div>
          </div>
          
          <div className="px-6 pb-8 flex flex-col items-center relative -mt-14">
            
            {/* Circle Avatar displaying first letter */}
            <div className="w-28 h-28 rounded-full border-4 border-white flex items-center justify-center shadow-xl mb-4 bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 text-white text-5xl font-black shrink-0 relative z-10 transform hover:scale-105 transition-transform duration-300">
              {firstLetter}
            </div>
            
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">
              {profileData.firstname} {profileData.lastname}
            </h1>
            
            <span className="text-xs font-bold tracking-wide text-white bg-gradient-to-r from-fuchsia-500 to-purple-600 px-4 py-1 rounded-full mb-6 shadow-md uppercase">
              {profileData.role || "User"}
            </span>

            {/* User Details Layout */}
            <div className="w-full bg-slate-50 rounded-2xl p-5 mb-6 border border-slate-200 shadow-inner">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-6">
                <div className="flex flex-col group">
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1 group-hover:text-purple-600 transition-colors">First Name</span>
                  <span className="text-slate-800 font-bold text-base">{profileData.firstname}</span>
                </div>
                <div className="flex flex-col group">
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1 group-hover:text-purple-600 transition-colors">Last Name</span>
                  <span className="text-slate-800 font-bold text-base">{profileData.lastname}</span>
                </div>
                <div className="flex flex-col md:col-span-2 group">
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1 group-hover:text-purple-600 transition-colors">Email Address</span>
                  <span className="text-slate-800 font-bold text-base">{profileData.email}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-5 w-full">
              <button 
                onClick={handleUpdateProfile}
                className="flex-1 px-4 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-purple-600 hover:to-indigo-600 text-white font-extrabold rounded-xl transition-all shadow-[0_8px_20px_rgba(99,102,241,0.3)] hover:shadow-[0_10px_25px_rgba(99,102,241,0.4)] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 hover:-translate-y-1"
              >
                Update Profile
              </button>
              <button 
                onClick={handleDeleteProfile}
                className="flex-1 px-4 py-4 bg-white border-2 border-red-500 hover:bg-red-50 text-red-600 font-bold rounded-xl transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 hover:-translate-y-1"
              >
                Delete Profile
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
