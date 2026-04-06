import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowRight, ShoppingBag, Truck, ShieldCheck, CreditCard } from 'lucide-react';
import axiosClient from '../utility/axios';
import { useSelector } from 'react-redux';
import { selectCurrentCollege } from '../CollegeSlice';

export default function HeroSection() {
  const navigate = useNavigate();
  const currentCollege = useSelector(selectCurrentCollege);
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch products to display in the hero cards
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchParams = { page: 1 };
        if (currentCollege && currentCollege !== "Select College") {
          fetchParams.college = currentCollege;
        }
        const res = await axiosClient.get("/product/getallproduct", { params: fetchParams });
        if (res.data && res.data.allproduct) {
          setProducts(res.data.allproduct);
        }
      } catch (err) {
        console.error("Failed to fetch products for hero", err);
      }
    };
    fetchProducts();
  }, [currentCollege]);

  // Product Carousel Effect (every 5 seconds)
  useEffect(() => {
    if (products.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [products.length]);

  const currentProduct = products.length > 0 ? products[currentIndex] : null;
  const trendingIndex = products.length > 1 ? (currentIndex + Math.floor(products.length / 2)) % products.length : 0;
  const nextProduct = products.length > 0 ? products[trendingIndex] : null;

  const handleCardClick = (product) => {
    if (product) {
      navigate(`/shop?q=${encodeURIComponent(product.name)}`);
    }
  };

  return (
    <div className="relative bg-slate-50 pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">

      {/* Dynamic Background Elements */}
      <div className="absolute top-0 right-[-10%] w-[50%] h-[100%] bg-gradient-to-bl from-brand-teal/20 to-transparent rounded-bl-full blur-[100px] z-0"></div>
      <div className="absolute top-[20%] left-[-10%] w-[40%] h-[60%] bg-gradient-to-tr from-brand-red/10 to-transparent rounded-tr-full blur-[80px] z-0"></div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">

          {/* Hero Content */}
          <div className="w-full lg:w-1/2 flex flex-col items-start text-left">
            <div className="inline-block px-4 py-1.5 rounded-full bg-red-100 text-brand-red font-bold text-sm mb-6 animate-[slowPulse_4s_ease-in-out_infinite]">
              Your Campus Marketplace — Buy, Sell & Save Smart
            </div>

            <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] tracking-tight mb-6">
              Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-teal to-brand-green">Quality</span><br />
              Products within college community.
            </h1>

            <p className="text-lg text-slate-600 mb-10 max-w-xl leading-relaxed">
              Explore essentials for college, hostel, and everyday needs
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link to="/shop" className="px-8 py-4 bg-slate-900 text-white rounded-full font-bold text-lg hover:bg-brand-teal transition-all duration-300 shadow-xl hover:shadow-[0_8px_30px_rgba(0,229,255,0.4)] hover:-translate-y-1 flex items-center justify-center gap-2">
                Shop Now <ArrowRight size={20} />
              </Link>
              <Link to="/categories" className="px-8 py-4 bg-white text-slate-800 border-2 border-slate-200 rounded-full font-bold text-lg hover:border-brand-teal hover:text-brand-teal transition-all duration-300 flex items-center justify-center">
                Explore Categories
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-6 mt-12 pt-8 border-t border-slate-200 w-full">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                <Truck size={20} className="text-brand-teal" /> Free Shipping
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                <ShieldCheck size={20} className="text-brand-green" /> 1 Year Warranty
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                <CreditCard size={20} className="text-brand-red" /> Secure Payment
              </div>
            </div>
          </div>

          {/* Hero Graphics/Images with Fetched Products */}
          <div className="w-full lg:w-1/2 relative h-[400px] lg:h-[600px] flex justify-center items-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-teal to-brand-red rounded-3xl opacity-20 blur-[60px] animate-pulse"></div>

            <div className="relative w-full h-full max-w-lg">
              
              {/* New Arrivals Product Card */}
              <div 
                className="absolute top-[10%] left-[10%] w-[60%] h-[60%] bg-white rounded-3xl shadow-2xl border border-white/50 backdrop-blur-sm z-20 flex flex-col items-center justify-center text-slate-300 animate-float overflow-hidden group cursor-pointer transition-all duration-500 ease-in-out"
                onClick={() => handleCardClick(currentProduct)}
              >
                {currentProduct && currentProduct.image ? (
                  <>
                    <img src={currentProduct.image} alt={currentProduct.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 pt-16 transition-opacity duration-300">
                      <span className="block font-bold text-white text-xl truncate">{currentProduct.name}</span>
                      <span className="block font-bold text-brand-teal mt-1">₹{currentProduct.price}</span>
                    </div>
                    {/* Badge */}
                    <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg z-10">New Arrival</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={64} className="opacity-50 text-brand-teal" />
                    <span className="absolute bottom-4 left-6 font-bold text-slate-800">New Arrivals</span>
                  </>
                )}
              </div>

              {/* Trending Product Card */}
              <div 
                className="absolute bottom-[10%] right-[10%] w-[50%] h-[50%] bg-slate-900 rounded-3xl shadow-2xl z-30 flex items-center justify-center text-slate-600 animate-float-reverse overflow-hidden group cursor-pointer transition-all duration-500 ease-in-out delay-100"
                onClick={() => handleCardClick(nextProduct)}
              >
                {nextProduct && nextProduct.image ? (
                  <>
                    <img src={nextProduct.image} alt={nextProduct.name} className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-110 group-hover:opacity-100 transition-all duration-700 ease-out" />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent p-5 pt-12 transition-opacity duration-300">
                      <span className="block font-bold text-white text-base truncate">{nextProduct.name}</span>
                      <span className="block font-bold text-brand-orange text-sm mt-0.5">₹{nextProduct.price}</span>
                    </div>
                  </>
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-red to-brand-orange opacity-80 blur-lg"></div>
                )}
                {/* Badge */}
                <span className="absolute top-4 right-4 bg-brand-red/90 backdrop-blur-sm text-white text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full shadow-lg z-20">Trending</span>
              </div>
              
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
