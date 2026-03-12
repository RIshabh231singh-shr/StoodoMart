import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingCart, Search, User, Package, LogOut, ChevronDown, Menu, X, ShieldAlert, Building2 } from 'lucide-react';
import { LogoutUserThunk } from '../Authslice';
import { selectCartItemsCount } from '../CartSlice';
import { selectCurrentCollege, setSelectedCollege } from '../CollegeSlice';
import CartDrawer from './CartDrawer';
import logo from '../assets/logo.png';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const cartItemsCount = useSelector(selectCartItemsCount);
  const currentCollege = useSelector(selectCurrentCollege);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Handle scroll effect for header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await dispatch(LogoutUserThunk());
    setProfileDropdownOpen(false);
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      navigate(`/shop?q=${encodeURIComponent(q)}`);
      setSearchQuery('');
    }
  };

  const handleCollegeChange = (e) => {
    dispatch(setSelectedCollege(e.target.value));
  };

  const handleSellItem = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user?.role === 'Admin' || user?.role === 'SuperAdmin') {
      navigate('/add-product');
    } else {
      navigate('/buy-and-sell');
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-5'
        }`}
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between">

          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 z-50">
            <img src={logo} alt="StoodoMart Logo" className="w-16 h-auto" />
            <h1 className={`text-2xl font-extrabold tracking-tight m-0 ${isScrolled ? 'text-slate-800' : 'text-slate-800'}`}>
              Stoodo<span className="text-brand-red">Mart</span>
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/shop" className="text-slate-700 font-semibold hover:text-brand-teal transition-colors duration-200">Shop</Link>
            <button 
              onClick={handleSellItem}
              className="text-brand-teal font-bold flex items-center gap-1 hover:text-brand-orange transition-colors duration-200"
            >
              Sell Item
            </button>
          </nav>

          {/* Search, Action Icons & Auth */}
          <div className="flex items-center gap-5">

            {/* Global College Selector */}
            <div className="hidden lg:flex items-center bg-slate-100/50 rounded-full px-3 py-1.5 border border-slate-200 focus-within:border-brand-teal transition-all">
              <Building2 size={16} className="text-brand-teal mr-2" />
              <select 
                value={currentCollege}
                onChange={handleCollegeChange}
                className="bg-transparent border-none outline-none text-sm font-semibold text-slate-700 cursor-pointer appearance-none pr-4"
              >
                <option value="Select College">Select College</option>
                <option value="NIT Calicut">NIT Calicut</option>
              </select>
            </div>

            {/* Search */}
            <form
              onSubmit={handleSearch}
              className="hidden lg:flex items-center bg-slate-100 rounded-full px-4 py-2 border border-slate-200 focus-within:border-brand-teal focus-within:ring-2 focus-within:ring-brand-teal/20 transition-all duration-300 w-64 lg:w-80"
            >
              <button type="submit" className="text-slate-400 mr-2 hover:text-brand-teal transition-colors flex-shrink-0">
                <Search size={18} />
              </button>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-sm w-full text-slate-700 placeholder:text-slate-400"
              />
            </form>

            {/* Cart Icon */}
            <div className="relative group cursor-pointer" onClick={() => setCartOpen(true)}>
              <div className="p-2 rounded-full hover:bg-slate-100 transition-colors duration-200">
                <ShoppingCart size={24} className="text-slate-700 group-hover:text-brand-teal transition-colors" />
              </div>
              {cartItemsCount > 0 && (
                <span className="absolute top-0 right-0 bg-brand-red text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center transform translate-x-1 -translate-y-1">
                  {cartItemsCount > 9 ? '9+' : cartItemsCount}
                </span>
              )}
            </div>

            {/* Auth Block */}
            <div className="hidden sm:block">
              {isAuthenticated ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 p-1 pl-1 pr-3 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors border border-slate-200"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-teal to-brand-green flex items-center justify-center text-white font-bold shadow-sm shadow-brand-teal/30">
                      {user?.firstname ? user.firstname.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="text-sm font-semibold text-slate-700">
                      {user?.firstname || 'Account'}
                    </span>
                    <ChevronDown size={14} className={`text-slate-500 transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Profile Dropdown */}
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 animate-slide-up transform origin-top-right z-50">
                      <div className="px-4 py-3 border-b border-slate-100 mb-2">
                        <p className="text-sm font-bold text-slate-800">{user?.firstname} {user?.lastname}</p>
                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                      </div>
                      <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-teal transition-colors">
                        <User size={16} /> My Profile
                      </Link>
                      <Link to="/my-orders" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-teal transition-colors">
                        <Package size={16} /> My Orders
                      </Link>
                      {user?.role === 'Admin' && (
                        <Link to="/my-products" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-teal transition-colors">
                          <Package size={16} /> My Products
                        </Link>
                      )}
                      {user?.role === 'SuperAdmin' && (
                        <Link to="/superadmin/requests" className="flex items-center gap-3 px-4 py-2.5 text-sm text-amber-600 hover:bg-amber-50 font-bold transition-colors">
                          <ShieldAlert size={16} /> Manage Requests
                        </Link>
                      )}
                      <div className="h-px bg-slate-100 my-2 mx-4"></div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                      >
                        <LogOut size={16} /> Log Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link to="/login" className="px-5 py-2 text-sm font-bold text-slate-700 hover:text-brand-teal transition-colors">Log In</Link>
                  <Link to="/signup" className="px-5 py-2 text-sm font-bold text-white bg-slate-900 rounded-full hover:bg-brand-teal transition-all duration-300 shadow-md">Sign Up</Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-full"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-slate-100 py-4 px-6 flex flex-col gap-4 animate-slide-up">
          
          {/* Mobile College Selector */}
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-full px-4 py-3 mb-2">
            <Building2 size={18} className="text-brand-teal mr-3" />
            <select 
              value={currentCollege}
              onChange={handleCollegeChange}
              className="bg-transparent border-none outline-none text-sm font-bold text-slate-700 w-full cursor-pointer appearance-none"
            >
              <option value="Select College">Select College</option>
              <option value="NIT Calicut">NIT Calicut</option>
            </select>
          </div>

          <div className="flex items-center bg-slate-100 rounded-full px-4 py-2 mb-2">
            <Search size={18} className="text-slate-400 mr-2" />
            <input type="text" placeholder="Search products..." className="bg-transparent border-none outline-none text-sm w-full" />
          </div>
          <Link to="/shop" className="text-lg font-semibold text-slate-700 py-2 border-b border-slate-100">Shop</Link>
          <button 
            onClick={() => {
              setMobileMenuOpen(false);
              handleSellItem();
            }}
            className="text-lg font-bold text-brand-teal py-2 border-b border-slate-100 text-left"
          >
            Sell Item
          </button>

          <div className="flex flex-col gap-3 mt-4">
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="flex items-center gap-3 py-2 text-slate-700"><User size={18} /> My Profile</Link>
                <Link to="/orders" className="flex items-center gap-3 py-2 text-slate-700"><Package size={18} /> My Orders</Link>
                {user?.role === 'SuperAdmin' && (
                  <Link to="/superadmin/requests" className="flex items-center gap-3 py-2 text-amber-600 font-bold">
                    <ShieldAlert size={18} /> Manage Requests
                  </Link>
                )}
                <button onClick={handleLogout} className="flex items-center gap-3 py-2 text-red-600 font-bold text-left"><LogOut size={18} /> Log Out</button>
              </>
            ) : (
              <div className="flex flex-col gap-3">
                <Link to="/login" className="w-full text-center px-5 py-3 text-base font-bold text-slate-800 border-2 border-slate-200 rounded-xl">Log In</Link>
                <Link to="/signup" className="w-full text-center px-5 py-3 text-base font-bold text-white bg-slate-900 rounded-xl">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  );
}
