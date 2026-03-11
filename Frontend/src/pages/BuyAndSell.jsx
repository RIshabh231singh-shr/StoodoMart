import React, { useState } from "react";
import { Link } from "react-router";
import { useSelector } from "react-redux";
import { BookOpen, Camera, Smartphone, Package, ShieldCheck, Zap, Handshake, ArrowRight } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axiosClient from "../utility/axios";

export default function BuyAndSell() {
  return (
    <div className="min-h-screen font-sans flex flex-col bg-slate-50 text-slate-900">
      <Header />

      <main className="flex-grow pt-24 md:pt-32 pb-20">

        {/* Hero Section */}
        <section className="relative overflow-hidden bg-slate-900 text-white py-20 lg:py-32 mb-16">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-teal/20 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-orange/20 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>

          <div className="container mx-auto px-4 md:px-8 relative z-10 flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-brand-teal text-sm font-bold uppercase tracking-wider mb-6">
                <ShieldCheck size={16} /> Campus Exclusive Marketplace
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6 leading-tight">
                Turn Your Old Books & Gear Into <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-teal to-brand-green">Cash!</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                StoodoMart connects you directly with students on your campus. Buy what you need for cheaper, and sell what you don't. No shipping fees, no waiting.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  to="/add-product"
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-brand-teal to-brand-green hover:from-emerald-400 hover:to-emerald-500 text-slate-900 font-black rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:shadow-[0_0_30px_rgba(0,229,255,0.5)] transform hover:-translate-y-1 flex items-center justify-center gap-2 text-lg"
                >
                  Start Selling Now <ArrowRight size={20} />
                </Link>
                <Link
                  to="/shop"
                  className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-lg"
                >
                  Browse Campus Deals
                </Link>
              </div>
            </div>

            <div className="flex-1 w-full max-w-lg lg:max-w-none relative">
              <div className="relative aspect-square md:aspect-video lg:aspect-square w-full">
                {/* Decorative abstract shapes for the hero image area */}
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-teal via-brand-red to-brand-orange rounded-3xl transform rotate-3 opacity-20 blur-lg"></div>
                <div className="absolute inset-4 bg-slate-800 rounded-3xl border border-white/10 overflow-hidden shadow-2xl flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-4 p-8 w-full h-full">
                    <div className="bg-slate-700/50 rounded-2xl p-6 flex flex-col items-center justify-center border border-slate-600/50 hover:bg-slate-700 transition-colors">
                      <BookOpen size={48} className="text-brand-orange mb-4" />
                      <span className="font-bold">Textbooks</span>
                    </div>
                    <div className="bg-slate-700/50 rounded-2xl p-6 flex flex-col items-center justify-center border border-slate-600/50 hover:bg-slate-700 transition-colors">
                      <Smartphone size={48} className="text-brand-teal mb-4" />
                      <span className="font-bold">Electronics</span>
                    </div>
                    <div className="bg-slate-700/50 rounded-2xl p-6 flex flex-col items-center justify-center border border-slate-600/50 hover:bg-slate-700 transition-colors">
                      <Package size={48} className="text-emerald-400 mb-4" />
                      <span className="font-bold">Hostel Essentials</span>
                    </div>
                    <div className="bg-slate-700/50 rounded-2xl p-6 flex flex-col items-center justify-center border border-slate-600/50 hover:bg-slate-700 transition-colors">
                      <Camera size={48} className="text-brand-red mb-4" />
                      <span className="font-bold">Instruments</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="container mx-auto px-4 md:px-8 max-w-6xl mb-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tight text-slate-800">
              How Peer-to-Peer Works
            </h2>
            <div className="w-20 h-1.5 bg-brand-teal mx-auto rounded-full mb-6"></div>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Our campus-only marketplace model makes buying and selling safer, faster, and completely free of annoying shipping costs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-[40%] left-[15%] right-[15%] h-0.5 bg-slate-200 z-0"></div>

            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm relative z-10 flex flex-col justify-between items-center text-center transform hover:-translate-y-2 transition-transform duration-300">
              <div className="w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 text-emerald-500 shadow-sm border border-emerald-100">
                <Package size={32} />
              </div>
              <div className="absolute top-2 left-2 bg-slate-100 w-8 h-8 rounded-full flex items-center justify-center font-black text-slate-400">1</div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">Snap & List</h3>
              <p className="text-slate-500">Take a picture of the item you want to sell, add a short description, and set your price. It takes less than a minute.</p>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm relative z-10 flex flex-col items-center justify-between text-center transform hover:-translate-y-2 transition-transform duration-300">
              <div className="w-20 h-20 bg-brand-teal/10 rounded-2xl flex items-center justify-center mb-6 text-brand-teal shadow-sm border border-brand-teal/20">
                <Zap size={32} />
              </div>
              <div className="absolute top-2 left-2 bg-slate-100 w-8 h-8 rounded-full flex items-center justify-center font-black text-slate-400">2</div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">Get Connected</h3>
              <p className="text-slate-500">When another student on your campus buys your item, you'll immediately get notified to arrange a meetup.</p>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm relative z-10 flex flex-col items-center justify-between text-center transform hover:-translate-y-2 transition-transform duration-300">
              <div className="w-20 h-20 bg-brand-red/10 rounded-2xl flex items-center justify-center mb-6 text-brand-red shadow-sm border border-brand-red/20">
                <Handshake size={32} />
              </div>
              <div className="absolute top-2 left-2 bg-slate-100 w-8 h-8 rounded-full flex items-center justify-center font-black text-slate-400">3</div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">Meet & Exchange</h3>
              <p className="text-slate-500">Meet up safely on campus—in the library, dining hall, or hostel—to hand over the item and get paid instantly.</p>
            </div>
          </div>
        </section>

        {/* Sell Request Section */}
        <section className="container mx-auto px-4 md:px-8 max-w-4xl mb-12">
          <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-teal/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
            
            <div className="relative z-10">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-black mb-4 tracking-tight text-slate-800">
                  Ready to Start Selling?
                </h2>
                <p className="text-slate-600 max-w-xl mx-auto">
                  To ensure quality and security on our campus marketplace, all new sellers must be approved by an administrator. Submit a quick request below!
                </p>
              </div>

              <AdminRequestForm />
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}

// Subcomponent for the Admin Request Form
function AdminRequestForm() {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
        setMessage({ type: 'error', text: 'You must be logged in to become a seller.' });
        return;
    }
    
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
        const res = await axiosClient.post('/admin-request/create', { reason });
        setMessage({ type: 'success', text: res.data.message });
        setReason('');
    } catch (err) {
        setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to submit request.' });
    } finally {
        setLoading(false);
    }
  };

  if (user?.role === 'Admin' || user?.role === 'SuperAdmin') {
      return (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
              <ShieldCheck className="mx-auto h-12 w-12 text-emerald-500 mb-2" />
              <h3 className="font-bold text-emerald-800 text-lg">You are already an approved Seller!</h3>
              <p className="text-emerald-600 mt-2">Head over to your dashboard to start listing products.</p>
              <Link to="/add-product" className="inline-block mt-4 px-6 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors">
                  Add a Product
              </Link>
          </div>
      );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      {message.text && (
        <div className={`mb-6 p-4 rounded-xl border ${message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'}`}>
          {message.text}
        </div>
      )}
      
      <div className="mb-6">
        <label htmlFor="reason" className="block text-sm font-bold text-slate-700 mb-2">
          Why do you want to become a seller? (Minimum 10 characters)
        </label>
        <textarea
          id="reason"
          rows="4"
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-teal focus:border-transparent outline-none transition-all resize-none"
          placeholder="I have some old textbooks and electronics from last semester that I'd like to sell to juniors..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
          minLength={10}
        ></textarea>
      </div>
      
      <button
        type="submit"
        disabled={loading || reason.length < 10}
        className="w-full py-4 bg-slate-900 hover:bg-brand-teal text-white font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
           <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
        ) : (
           <>Submit Request to Admin <ArrowRight size={18} /></>
        )}
      </button>
    </form>
  );
}
