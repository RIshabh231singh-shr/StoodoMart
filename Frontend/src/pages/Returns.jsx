import React from "react";
import { Link } from "react-router";
import { RefreshCcw, AlertTriangle, CheckCircle, Package, Clock, HelpCircle } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Returns() {
  return (
    <div className="min-h-screen font-sans flex flex-col bg-slate-50 text-slate-900">
      <Header />
      
      <main className="flex-grow pt-24 md:pt-32 pb-20">
        
        {/* Page Header */}
        <div className="bg-slate-900 text-white py-16 md:py-24 mb-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-red/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-teal/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
          
          <div className="container mx-auto px-4 md:px-8 max-w-4xl relative z-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md mb-6 shadow-xl border border-white/20">
               <RefreshCcw size={32} className="text-brand-red" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
              Returns & Exchanges
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              We want you to be completely satisfied with your purchase. 
              Here is everything you need to know about our return policy.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          
          {/* Main Policy Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            
            {/* StoodoMart Direct Items */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 h-full flex flex-col">
              <div className="w-14 h-14 bg-brand-teal/10 text-brand-teal rounded-2xl flex items-center justify-center mb-6">
                <Package size={28} />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-slate-800">StoodoMart Official Items</h2>
              <p className="text-slate-600 mb-6 flex-grow">
                Items purchased directly from our official StoodoMart inventory can be returned within <strong>7 days</strong> of delivery for a full refund or exchange.
              </p>
              <ul className="space-y-3 mb-6">
                 <li className="flex items-start gap-3 text-sm text-slate-600">
                   <CheckCircle size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                   <span>Item must be unused and in original packaging.</span>
                 </li>
                 <li className="flex items-start gap-3 text-sm text-slate-600">
                   <CheckCircle size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                   <span>Tags must still be attached (if applicable).</span>
                 </li>
                 <li className="flex items-start gap-3 text-sm text-slate-600">
                   <CheckCircle size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                   <span>Receipt or proof of purchase is required.</span>
                 </li>
              </ul>
            </div>

            {/* Peer-to-Peer Items */}
            <div className="bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-700 text-white h-full flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                 <AlertTriangle size={100} />
              </div>
              <div className="w-14 h-14 bg-white/10 text-brand-orange rounded-2xl flex items-center justify-center mb-6 relative z-10">
                <AlertTriangle size={28} />
              </div>
              <h2 className="text-2xl font-bold mb-4 relative z-10">Peer-to-Peer Items</h2>
              <p className="text-slate-300 mb-6 flex-grow relative z-10">
                Items purchased directly from other students via our Campus Marketplace are <strong>final sale</strong>. StoodoMart does not facilitate returns for peer-to-peer transactions.
              </p>
              <div className="bg-white/5 border border-white/10 p-4 rounded-xl relative z-10">
                <p className="text-sm text-slate-300 italic">
                  Tip: Always inspect items carefully before completing the hand-off on campus. If an item drastically differs from its description, please report the user to support.
                </p>
              </div>
            </div>

          </div>

          {/* Process Timeline */}
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-200 mb-16">
             <h3 className="text-2xl font-bold mb-10 text-center text-slate-800">How to Initiate a Return</h3>
             
             <div className="relative border-l-2 border-slate-100 ml-4 md:ml-8 space-y-12 pb-4">
                
                {/* Step 1 */}
                <div className="relative pl-8 md:pl-12">
                   <div className="absolute -left-[17px] top-1 bg-brand-teal w-8 h-8 rounded-full border-4 border-white flex items-center justify-center text-white font-bold text-sm shadow-sm">1</div>
                   <h4 className="text-lg font-bold text-slate-800 mb-2">Contact Support</h4>
                   <p className="text-slate-600">Email our team at <a href="mailto:support@stoodomart.com" className="text-brand-teal hover:underline font-medium">support@stoodomart.com</a> with your Order ID and the reason for the return. Please include photos if the item is damaged.</p>
                </div>

                {/* Step 2 */}
                <div className="relative pl-8 md:pl-12">
                   <div className="absolute -left-[17px] top-1 bg-brand-teal w-8 h-8 rounded-full border-4 border-white flex items-center justify-center text-white font-bold text-sm shadow-sm">2</div>
                   <h4 className="text-lg font-bold text-slate-800 mb-2">Get Approval</h4>
                   <p className="text-slate-600">Our team will review your request within 24 hours. If approved, we will send you a Return Authorization (RA) number and instructions on where to drop off the item.</p>
                </div>

                {/* Step 3 */}
                <div className="relative pl-8 md:pl-12">
                   <div className="absolute -left-[17px] top-1 bg-slate-200 text-slate-500 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center font-bold text-sm shadow-sm">
                     <Clock size={14} />
                   </div>
                   <h4 className="text-lg font-bold text-slate-800 mb-2">Receive Refund</h4>
                   <p className="text-slate-600">Once we receive and inspect the item, we will process your refund. Returns to the original payment method typically take 3-5 business days to appear.</p>
                </div>

             </div>
          </div>

          {/* Need Help Action */}
          <div className="bg-gradient-to-r from-brand-teal/10 to-brand-green/10 rounded-3xl p-8 md:p-10 text-center border border-brand-teal/20">
             <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm text-brand-teal">
                <HelpCircle size={32} />
             </div>
             <h3 className="text-2xl font-bold mb-4 text-slate-800">Need specific help?</h3>
             <p className="text-slate-600 mb-8 max-w-lg mx-auto">
               If you received a defective item or an entirely wrong order, don't worry. We will cover all expenses and issue an immediate replacement.
             </p>
             <Link 
               to="/contact" 
               className="inline-flex px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-full transition-all duration-300 shadow-md transform hover:-translate-y-0.5"
             >
               Contact Support Team
             </Link>
          </div>

        </div>
      </main>
      
      <Footer />
    </div>
  );
}
