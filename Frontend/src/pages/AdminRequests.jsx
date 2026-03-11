import React, { useState, useEffect } from 'react';
import axiosClient from '../utility/axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ShieldAlert, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function AdminRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('Pending'); // 'Pending', 'Approved', 'Rejected'

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
    try {
      await axiosClient.put(`/admin-request/admin/${requestId}/status`, { status: newStatus });
      // Remove or refresh the request list
      fetchRequests(activeTab);
    } catch (err) {
      alert(err.response?.data?.message || `Failed to mark request as ${newStatus}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900">
      <Header />

      <main className="flex-grow pt-32 pb-16 container mx-auto px-4 md:px-8 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-black mb-2 tracking-tight">Admin & Seller Requests</h1>
          <p className="text-slate-600">Review and approve applications from users wanting to become Sellers/Admins.</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 border-b border-slate-200 mb-8">
          {['Pending', 'Approved', 'Rejected'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-semibold text-sm transition-colors border-b-2 ${activeTab === tab
                  ? 'border-brand-teal text-brand-teal'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
            >
              {tab} Requests
            </button>
          ))}
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-md text-red-700">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-teal"></div>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <ShieldAlert className="mx-auto h-16 w-16 text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-700 mb-2">No {activeTab} Requests</h3>
            <p className="text-slate-500">There are currently no {activeTab.toLowerCase()} admin requests.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {requests.map(request => (
              <div key={request._id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold">
                      {request.userId.firstname} {request.userId.lastname}
                    </h3>
                    <span className="text-sm px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-medium">
                      {request.userId.email}
                    </span>
                    {request.status === 'Pending' && <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded bg-amber-100 text-amber-700"><Clock size={12} /> Pending</span>}
                    {request.status === 'Approved' && <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded bg-emerald-100 text-emerald-700"><CheckCircle size={12} /> Approved</span>}
                    {request.status === 'Rejected' && <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded bg-rose-100 text-rose-700"><XCircle size={12} /> Rejected</span>}
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-slate-700 mb-2">
                    <p className="text-sm font-semibold text-slate-500 mb-1">Reason for Request:</p>
                    <p>{request.reason}</p>
                  </div>
                  <p className="text-xs text-slate-400">Requested on: {new Date(request.createdAt).toLocaleDateString()}</p>
                </div>

                {request.status === 'Pending' && (
                  <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto mt-4 md:mt-0">
                    <button
                      onClick={() => handleUpdateStatus(request._id, 'Approved')}
                      className="flex-1 md:flex-none px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-colors shadow-sm"
                    >
                      ✅ Approve
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(request._id, 'Rejected')}
                      className="flex-1 md:flex-none px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl transition-colors"
                    >
                      ❌ Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
