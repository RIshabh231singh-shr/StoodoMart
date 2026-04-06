import React, { useState, useEffect } from 'react';
import axiosClient from '../utility/axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ShieldAlert, CheckCircle, XCircle, Clock, ArrowLeft, ShieldCheck, UserCheck, UserX, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router';

export default function AdminRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('Pending'); // 'Pending', 'Approved', 'Rejected'
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests(activeTab);
  }, [activeTab]);

  const fetchRequests = async (status) => {
    setLoading(true);
    setError('');
    try {
      const res = await axiosClient.get(`/admin-request/admin?status=${status}`);
      setRequests(res.data.requests);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch admin requests.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (requestId, newStatus) => {
    let adminNote = '';
    if (newStatus === 'Rejected') {
      adminNote = window.prompt("Please provide a reason for rejection (optional):");
      if (adminNote === null) return; // User cancelled prompt
    }

    try {
      await axiosClient.put(`/admin-request/admin/${requestId}/status`, { 
        status: newStatus,
        adminNote: adminNote 
      });
      fetchRequests(activeTab);
    } catch (err) {
      alert(err.response?.data?.message || `Failed to mark request as ${newStatus}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900">
      <Header />

      <main className="flex-grow pt-32 pb-24 container mx-auto px-4 md:px-8 max-w-5xl">
        
        {/* Page Header */}
        <div className="mb-12">
          <button 
                onClick={() => navigate("/profile")}
                className="flex items-center gap-2 text-slate-500 hover:text-brand-teal font-bold mb-4 transition-colors group"
              >
               <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to Profile
          </button>
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 shadow-sm">
               <ShieldCheck size={28} />
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">Privilege Requests</h1>
          </div>
          <p className="text-slate-500 font-medium max-w-2xl">Audit and decide on user applications for Seller and Campus Admin status.</p>
        </div>

        {/* Modern Tabs */}
        <div className="flex p-1 bg-slate-100 rounded-2xl w-full max-w-md mb-12 shadow-inner border border-slate-200">
          {['Pending', 'Approved', 'Rejected'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all duration-300 ${activeTab === tab
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-8 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-center gap-3 font-bold">
            <ShieldAlert size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Content Area */}
        <div className="min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <div className="w-12 h-12 border-4 border-slate-100 border-t-brand-teal rounded-full animate-spin"></div>
              <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Filtering Database...</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 px-8 text-center bg-white rounded-[2.5rem] border border-slate-200 shadow-sm">
              <div className="w-20 h-20 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-200 mb-6">
                <ShieldAlert size={40} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">No {activeTab} Requests</h3>
              <p className="text-slate-500 max-w-sm">The queue is empty. There are no {activeTab.toLowerCase()} admin requests to display at this time.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {requests.map(request => (
                <div key={request._id} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
                  <div className={`absolute top-0 left-0 w-1 h-full ${activeTab === 'Pending' ? 'bg-amber-400' : activeTab === 'Approved' ? 'bg-emerald-400' : 'bg-rose-400'}`}></div>

                  <div className="flex flex-col lg:flex-row gap-8 items-start">
                    
                    <div className="flex-1 space-y-6">
                      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-500 border border-slate-200 text-lg">
                            {request.userId?.firstname?.[0] || 'U'}
                          </div>
                          <div>
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">
                              {request.userId?.firstname} {request.userId?.lastname}
                            </h3>
                            <p className="text-slate-400 text-sm font-bold tracking-tight">{request.userId?.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                           <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Requested</span>
                           <span className="text-xs font-bold text-slate-700 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                             {new Date(request.createdAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}
                           </span>
                        </div>
                      </header>

                      <div className="space-y-4">
                        <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100 group-hover:border-slate-200 transition-colors">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2">
                            <MessageSquare size={12} className="text-brand-teal" /> Statement of Purpose
                          </p>
                          <p className="text-slate-800 leading-relaxed font-bold">{request.reason}</p>
                        </div>

                        {request.adminNote && (
                          <div className="p-5 bg-indigo-50 border border-indigo-100 rounded-3xl group-hover:shadow-inner transition-all">
                            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-2 flex items-center gap-2">
                              <ShieldCheck size={12} className="text-indigo-500" /> Administrative Feedback
                            </p>
                            <p className="italic text-indigo-600 font-bold leading-relaxed">"{request.adminNote}"</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {request.status === 'Pending' && (
                      <div className="flex flex-row lg:flex-col gap-3 w-full lg:w-auto shrink-0 pt-4 lg:pt-0 lg:border-l lg:border-slate-50 lg:pl-8">
                        <button
                          onClick={() => handleUpdateStatus(request._id, 'Approved')}
                          className="flex-1 lg:px-8 py-4 bg-slate-900 hover:bg-brand-teal text-white font-black rounded-2xl transition-all shadow-xl shadow-slate-100 hover:shadow-brand-teal/20 hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2"
                        >
                          <UserCheck size={18} /> Grant Access
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(request._id, 'Rejected')}
                          className="flex-1 lg:px-8 py-4 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-500 border border-slate-200 hover:border-rose-100 font-black rounded-2xl transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2"
                        >
                          <UserX size={18} /> Dimiss
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
