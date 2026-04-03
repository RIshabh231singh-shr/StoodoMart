import React from 'react';
import { Link } from 'react-router';
import Header from '../components/Header';
import Footer from '../components/Footer';

const CATEGORIES = [
  {
    id: 1,
    name: "Electronics And Instruments",
    slug: "electronics-and-instruments",
    bgGradient: "from-blue-600 to-indigo-700"
  },
  {
    id: 2,
    name: "Stationary And Clothing",
    slug: "stationary-and-clothing",
    bgGradient: "from-rose-500 to-pink-600"
  },
  {
    id: 3,
    name: "Sports & Fitness",
    slug: "sports-and-fitness",
    bgGradient: "from-emerald-500 to-teal-600"
  },
  {
    id: 4,
    name: "Hostel Essentials",
    slug: "hostel-essentials",
    bgGradient: "from-orange-500 to-amber-600"
  }
];

export default function Categories() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900">
      <Header />

      <main className="flex-grow pt-32 pb-16">
        <section className="container mx-auto px-4 md:px-8 max-w-7xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
              All Categories
            </h1>
            <div className="w-20 h-1.5 bg-brand-teal mx-auto rounded-full"></div>
            <p className="mt-4 text-slate-600 max-w-md mx-auto">
              Browse our complete catalog organized by whatever you need for campus life.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {CATEGORIES.map((category) => (
              <Link
                key={category.id}
                to={`/category/${category.slug}`}
                className="group relative block h-72 w-full overflow-hidden rounded-3xl bg-slate-200 shadow-md hover:shadow-2xl transition-all duration-500 ease-out hover:-translate-y-2"
              >
                {/* Background Layer */}
                <div className={`absolute inset-0 bg-gradient-to-br ${category.bgGradient} transition-transform duration-700 group-hover:scale-110`} />

                {/* Visual Overlay */}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300" />

                {/* Content Layer */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <h3 className="text-white text-2xl font-bold tracking-wide drop-shadow-md transition-transform duration-300 group-hover:scale-105 whitespace-pre-line">
                    {category.name.replace(" And ", " And\n")}
                  </h3>

                  {/* Interaction Hint */}
                  <div className="mt-4 overflow-hidden">
                    <span className="inline-block px-5 py-2 bg-white/20 backdrop-blur-md text-white text-sm font-semibold rounded-full border border-white/30 translate-y-12 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      Browse Store
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
