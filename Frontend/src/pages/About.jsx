import React from 'react';
import { Link } from 'react-router';
import { Target, Users, Zap, CheckCircle, ArrowRight, BookOpen } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function About() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900">
      <Header />

      <main className="flex-grow pt-24 md:pt-32 pb-20">
        
        {/* Modern Hero Section */}
        <section className="relative overflow-hidden bg-slate-900 text-white py-20 lg:py-32 mb-16">
          {/* Abstract background shapes */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-teal/20 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-red/20 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
          <div className="absolute top-1/2 left-1/2 w-full h-full bg-brand-green/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
          
          <div className="container mx-auto px-4 md:px-8 relative z-10 flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-brand-teal text-sm font-bold uppercase tracking-wider mb-6">
              <BookOpen size={16} /> Built For Students
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tight mb-8 leading-tight max-w-4xl">
              About Stoodo<span className="text-brand-red">Mart</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-light">
              We're redefining the college experience by building the ultimate marketplace designed <span className="text-brand-teal font-semibold">exclusively for the student community.</span>
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          
          {/* Mission Statement Block */}
          <section className="bg-white rounded-3xl p-10 md:p-16 shadow-xl shadow-slate-200/50 border border-slate-100 mb-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-bl-full -z-10"></div>
            <div className="max-w-3xl">
              <div className="w-16 h-16 bg-brand-teal/10 text-brand-teal rounded-2xl flex items-center justify-center mb-8">
                <Target size={32} />
              </div>
              <h2 className="text-3xl md:text-4xl font-black mb-6 text-slate-800">Our Mission</h2>
              <p className="text-slate-600 leading-relaxed text-lg md:text-xl">
                StoodoMart is a dedicated marketplace designed exclusively for students. We understand the unique needs of college life, whether it's finding the right textbooks, scoring affordable hostel essentials, or discovering amazing deals on electronics. 
              </p>
              <p className="text-slate-600 leading-relaxed text-lg md:text-xl mt-4">
                Our mission is to make student life easier and more affordable by connecting you with everything you need in one place, while fostering a safe peer-to-peer campus economy.
              </p>
            </div>
          </section>

          {/* Why Choose Us Grid */}
          <section className="mb-24">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black mb-4 text-slate-800">Why Choose Us?</h2>
              <div className="w-20 h-1.5 bg-brand-teal mx-auto rounded-full mb-6"></div>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                We focus on the specific needs of university life, offering tools and deals you won't find on generic marketplaces.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 text-emerald-500 border border-emerald-100">
                  <CheckCircle size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-800">Curated for Students</h3>
                <p className="text-slate-600 leading-relaxed">
                  Every category, product, and feature is selected with the student lifestyle in mind. No clutter, just the essentials you need to succeed.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="w-14 h-14 bg-brand-teal/10 rounded-2xl flex items-center justify-center mb-6 text-brand-teal border border-brand-teal/20">
                  <Users size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-800">Campus Community</h3>
                <p className="text-slate-600 leading-relaxed">
                  Buy, sell, and trade products directly within your college campus easily and securely. No shipping fees, no waiting.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="w-14 h-14 bg-brand-red/10 rounded-2xl flex items-center justify-center mb-6 text-brand-red border border-brand-red/20">
                  <Zap size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-800">Unbeatable Deals</h3>
                <p className="text-slate-600 leading-relaxed">
                  We negotiate exclusive discounts just for registered students. Get premium gear and software for a fraction of the retail price.
                </p>
              </div>
            </div>
          </section>

          {/* Call to Action Bar */}
          <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-10 md:p-12 text-center text-white border border-slate-700 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-5">
                <Users size={120} />
             </div>
             <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
               <div className="text-left md:max-w-xl">
                 <h2 className="text-3xl font-bold mb-3">Shape the Future of StoodoMart</h2>
                 <p className="text-slate-300 text-lg">
                   We're constantly evolving to better serve the student community. Have a suggestion, feedback, or a question? We want to hear from you.
                 </p>
               </div>
               <Link 
                 to="/contact" 
                 className="w-full md:w-auto px-8 py-4 bg-brand-teal hover:bg-emerald-400 text-slate-900 font-bold rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:shadow-[0_0_30px_rgba(0,229,255,0.5)] transform hover:-translate-y-1 flex items-center justify-center gap-2 whitespace-nowrap text-lg"
               >
                 Get in Touch <ArrowRight size={20} />
               </Link>
             </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
