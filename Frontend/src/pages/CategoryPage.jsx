import React from 'react';
import { useParams, Link } from 'react-router';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function CategoryPage() {
  const { slug } = useParams();

  // Format the slug back into a readable title (e.g., "electronics-and-instruments" -> "Electronics And Instruments")
  const title = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-12 md:py-20 lg:max-w-6xl">
        <div className="mb-8 flex items-center gap-2 text-sm text-slate-500">
          <Link to="/" className="hover:text-brand-teal transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-800 font-medium">Category</span>
          <span>/</span>
          <span className="text-brand-teal font-medium">{title}</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-black mb-12 tracking-tight">
          {title}
        </h1>

        {/* Placeholder for actual products */}
        <div className="bg-white p-12 rounded-3xl shadow-sm border border-slate-100 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 text-4xl mb-6">
            🛠️
          </div>
          <h2 className="text-2xl font-bold mb-4 text-slate-800">Products Coming Soon!</h2>
          <p className="text-slate-600 max-w-md mx-auto mb-8">
            We are currently sourcing the best products for the <strong>{title}</strong> category. Check back soon for amazing deals!
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center px-8 py-3 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
