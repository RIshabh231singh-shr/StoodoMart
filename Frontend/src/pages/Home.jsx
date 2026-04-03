import React from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      <Header />
      
      {/* Main Content Area */}
      <main className="flex-grow">
        <HeroSection />
        
        {/* Placeholder for Featured Categories / Products Grid */}
        <section className="py-20 container mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Featured Categories</h2>
            <div className="w-24 h-1 bg-brand-teal mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Mock Category Cards */}
            {[
              { name: "Electronics", bg: "from-blue-500 to-purple-600" },
              { name: "Fashion", bg: "from-pink-500 to-rose-500" },
              { name: "Home & Garden", bg: "from-emerald-400 to-teal-500" },
              { name: "Sports", bg: "from-orange-400 to-red-500" }
            ].map((cat, idx) => (
              <div key={idx} className="relative group rounded-3xl h-64 overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.bg} opacity-80 group-hover:opacity-100 transition-opacity duration-300`}></div>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-xl font-bold tracking-wide shadow-black/50 drop-shadow-md group-hover:scale-110 transition-transform duration-300">
                    {cat.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
        </section>
      </main>

      <Footer />
    </div>
  );
}
