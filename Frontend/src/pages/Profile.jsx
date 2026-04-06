import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { Link } from 'react-router';
import axiosClient from '../utility/axios';
import { LogoutUserThunk, ChangePasswordThunk } from '../Authslice';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { User, Mail, Shield, Lock, Trash2, Edit3, Package, ShoppingBag, ChevronRight } from 'lucide-react';

export default function Profile() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Password change states
  const [oldPassword] = useState('');
  const [newPassword] = useState('');
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Note: I'm keeping the original password state logic but the previous view showed 
  // they were being used. I'll make sure they are properly initialized and handled.
  const [currentOldPass, setCurrentOldPass] = useState('');
  const [currentNewPass, setCurrentNewPass] = useState('');

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

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    setPassError('');
    setPassSuccess('');

    if (!currentOldPass || !currentNewPass) {
      return setPassError('Please fill both fields');
    }

    if (currentNewPass.length < 6) {
      return setPassError('New password must be at least 6 characters');
    }

    setIsUpdatingPassword(true);

    const resultAction = await dispatch(
      ChangePasswordThunk({ oldPassword: currentOldPass, newPassword: currentNewPass })
    );

    setIsUpdatingPassword(false);

    if (resultAction.meta.requestStatus === "fulfilled") {
      setPassSuccess('Password changed successfully!');
      setCurrentOldPass('');
      setCurrentNewPass('');
    } else {
      setPassError(resultAction.payload || 'Failed to change password');
    }
  };

  const handleDeleteProfile = async () => {
    if (window.confirm("Are you sure to delete your profile? This action cannot be redeemed.")) {
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
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      <Header />
      <main className="flex-grow flex items-center justify-center pt-32 pb-20">
        <div className="animate-pulse flex flex-col items-center gap-5 w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <div className="w-28 h-28 bg-slate-100 rounded-full mb-4"></div>
          <div className="h-8 w-3/4 bg-slate-100 rounded-xl mb-6"></div>
          <div className="h-24 w-full bg-slate-100 rounded-2xl mb-6"></div>
          <div className="flex gap-4 w-full">
            <div className="h-14 w-1/2 bg-slate-100 rounded-xl"></div>
            <div className="h-14 w-1/2 bg-red-100 rounded-xl"></div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );

  if (error || !profileData) return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center text-center px-4 pt-32 pb-20">
        <div className="bg-white p-8 rounded-3xl max-w-md w-full border border-red-100 shadow-sm">
          <h2 className="text-2xl font-black text-red-600 mb-2">Failed to load profile</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button onClick={() => navigate("/")} className="w-full px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-brand-teal transition-all shadow-md">Go Home</button>
        </div>
      </main>
      <Footer />
    </div>
  );

  const firstLetter = profileData.firstname ? profileData.firstname.charAt(0).toUpperCase() : '?';

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900">
      <Header />

      <main className="flex-grow pt-32 pb-24 container mx-auto px-4 md:px-8 max-w-6xl">
        
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Sidebar Section */}
          <aside className="w-full lg:w-1/3 shrink-0 space-y-6">
            
            {/* Profile Avatar Card */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 flex flex-col items-center text-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-brand-teal"></div>
              
              <div className="w-32 h-32 rounded-full border-4 border-slate-50 flex items-center justify-center shadow-md mb-6 bg-gradient-to-br from-brand-teal via-emerald-400 to-brand-green shrink-0 relative z-10 transition-transform duration-500 group-hover:scale-105 overflow-hidden">
                {profileData.avatar ? (
                  <img src={profileData.avatar} alt={profileData.firstname} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white text-5xl font-black">{firstLetter}</span>
                )}
              </div>

              <h1 className="text-2xl font-black text-slate-900 mb-1 tracking-tight">
                {profileData.firstname} {profileData.lastname}
              </h1>
              
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest mb-6">
                <Shield size={12} className="text-brand-teal" /> {profileData.role || "Student"}
              </div>

              <div className="w-full grid grid-cols-2 gap-3 mt-2">
                <button
                  onClick={handleUpdateProfile}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 text-white text-sm font-bold rounded-xl transition-all hover:bg-brand-teal shadow-sm active:scale-95"
                >
                  <Edit3 size={16} /> Edit
                </button>
                <button
                  onClick={handleDeleteProfile}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 text-sm font-bold rounded-xl transition-all hover:bg-red-100 active:scale-95 border border-red-100"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>

            {/* Quick Links / Dashboard Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 px-2">Dashboard</h3>
              <nav className="flex flex-col gap-2">
                <Link to="/my-orders" className="flex items-center justify-between px-4 py-3 rounded-2xl hover:bg-slate-50 text-slate-700 font-bold transition-all group">
                  <div className="flex items-center gap-3">
                    <ShoppingBag size={18} className="text-brand-teal" />
                    <span>My Orders</span>
                  </div>
                  <ChevronRight size={16} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                </Link>
                
                {(profileData.role === 'Admin' || profileData.role === 'SuperAdmin') && (
                  <>
                    <Link to="/my-products" className="flex items-center justify-between px-4 py-3 rounded-2xl hover:bg-slate-50 text-slate-700 font-bold transition-all group">
                      <div className="flex items-center gap-3">
                        <Package size={18} className="text-brand-red" />
                        <span>My Products</span>
                      </div>
                      <ChevronRight size={16} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link to="/add-product" className="flex items-center justify-between px-4 py-3 rounded-2xl hover:bg-slate-50 text-slate-700 font-bold transition-all group">
                      <div className="flex items-center gap-3">
                        <Edit3 size={18} className="text-brand-green" />
                        <span>Add Product</span>
                      </div>
                      <ChevronRight size={16} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </>
                )}
                
                {profileData.role === 'SuperAdmin' && (
                  <Link to="/superadmin/all-profiles" className="flex items-center justify-between px-4 py-3 rounded-2xl hover:bg-slate-50 text-slate-700 font-bold transition-all group">
                    <div className="flex items-center gap-3">
                      <Shield size={18} className="text-amber-500" />
                      <span>All Profiles</span>
                    </div>
                    <ChevronRight size={16} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}
              </nav>
            </div>

          </aside>

          {/* Main Content Space */}
          <div className="w-full lg:flex-1 space-y-8">
            
            {/* Account Details Block */}
            <section className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-slate-200 relative overflow-hidden">
              <div className="flex items-center gap-3 mb-8 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-900 border border-slate-100 flex items-center justify-center">
                  <User size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 leading-tight">Account Details</h2>
                  <p className="text-slate-500 text-sm">Your personal information and credentials</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                <div className="space-y-1 group">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">First Name</label>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group-hover:border-brand-teal/50 transition-colors">
                    <p className="font-bold text-slate-800">{profileData.firstname}</p>
                  </div>
                </div>
                <div className="space-y-1 group">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Last Name</label>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group-hover:border-brand-teal/50 transition-colors">
                    <p className="font-bold text-slate-800">{profileData.lastname}</p>
                  </div>
                </div>
                <div className="md:col-span-2 space-y-1 group">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group-hover:border-brand-teal/50 transition-colors flex items-center gap-3 text-slate-800">
                    <Mail size={16} className="text-slate-400" />
                    <p className="font-bold">{profileData.email}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Security Section (Change Password) */}
            <section className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-900 border border-slate-100 flex items-center justify-center">
                  <Lock size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 leading-tight">Security</h2>
                  <p className="text-slate-500 text-sm">Update your password regularly to stay safe</p>
                </div>
              </div>

              <form onSubmit={handlePasswordChange} className="max-w-xl space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Current Password</label>
                    <input
                      type="password"
                      value={currentOldPass}
                      onChange={(e) => setCurrentOldPass(e.target.value)}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal focus:bg-white transition-all font-medium text-slate-800"
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">New Password</label>
                    <input
                      type="password"
                      value={currentNewPass}
                      onChange={(e) => setCurrentNewPass(e.target.value)}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal focus:bg-white transition-all font-medium text-slate-800"
                      placeholder="Min 6 characters"
                    />
                  </div>
                </div>

                {passError && <p className="text-red-500 text-xs font-bold px-1">{passError}</p>}
                {passSuccess && <p className="text-emerald-500 text-xs font-bold px-1">{passSuccess}</p>}

                <button
                  type="submit"
                  disabled={isUpdatingPassword}
                  className="px-8 py-4 bg-slate-900 hover:bg-brand-teal text-white font-black rounded-2xl transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-1 flex items-center gap-3"
                >
                  {isUpdatingPassword ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Updating...
                    </span>
                  ) : (
                    <>Update Password <Lock size={18} /></>
                  )}
                </button>
              </form>
            </section>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
