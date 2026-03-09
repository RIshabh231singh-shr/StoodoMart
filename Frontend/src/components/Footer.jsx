import React from 'react';
import { Link } from 'react-router';
import { Facebook, Twitter, Instagram, Youtube, Mail, MapPin, Phone } from 'lucide-react';
import logo from '../assets/logo.png';

export default function Footer() {
  return (
    <footer className="bg-slate-900 pt-16 pb-8 text-slate-300 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-teal/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-red/5 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Brand & About */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-6">
              <img src={logo} alt="StoodoMart Logo" className="w-10 h-auto filter brightness-0 invert" />
              <h1 className="text-2xl font-extrabold tracking-tight m-0 text-white">
                Stoodo<span className="text-brand-red">Mart</span>
              </h1>
            </Link>
            <p className="text-sm leading-relaxed mb-6 text-slate-400">
              Your one-stop destination for premium products. We offer the best deals on high-quality items with fast shipping and excellent customer service.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-brand-teal hover:text-white transition-all duration-300"><Facebook size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-brand-teal hover:text-white transition-all duration-300"><Twitter size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-brand-red hover:text-white transition-all duration-300"><Instagram size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-brand-red hover:text-white transition-all duration-300"><Youtube size={18} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-base font-bold mb-6 uppercase tracking-wider">Quick Links</h3>
            <ul className="flex flex-col gap-3">
              <li><Link to="/about" className="text-sm hover:text-brand-teal transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-brand-teal/50"></span> About Us</Link></li>
              <li><Link to="/shop" className="text-sm hover:text-brand-teal transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-brand-teal/50"></span> All Products</Link></li>
              <li><Link to="/deals" className="text-sm hover:text-brand-teal transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-brand-teal/50"></span> Exclusive Deals</Link></li>
              <li><Link to="/faq" className="text-sm hover:text-brand-teal transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-brand-teal/50"></span> FAQ</Link></li>
              <li><Link to="/contact" className="text-sm hover:text-brand-teal transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-brand-teal/50"></span> Contact Us</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white text-base font-bold mb-6 uppercase tracking-wider">Customer Service</h3>
            <ul className="flex flex-col gap-3 mb-6">
              <li><Link to="/buy-and-sell" className="text-sm hover:text-brand-teal transition-colors">Can buy and sell your products within college</Link></li>
              <li><Link to="/returns" className="text-sm hover:text-brand-teal transition-colors">Returns & Exchanges</Link></li>
              <li><Link to="/privacy" className="text-sm hover:text-brand-teal transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-sm hover:text-brand-teal transition-colors">Terms of Service</Link></li>
            </ul>

            <div className="flex flex-col gap-3 text-sm">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-brand-teal shrink-0 mt-0.5" />
                <span>Mega boys hotel 2 , NIT Calicut</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-brand-teal shrink-0" />
                <span>+91 9876543210</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-brand-teal shrink-0" />
                <span>support@stoodomart.com</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white text-base font-bold mb-6 uppercase tracking-wider">Newsletter</h3>
            <p className="text-sm mb-4 text-slate-400">Subscribe to our newsletter to receive updates on new products and special offers.</p>
            <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email address"
                className="bg-slate-800 border-none outline-none rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-brand-teal transition-all placeholder:text-slate-500"
                required
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-brand-teal to-brand-green text-white font-bold text-sm py-3 rounded-xl hover:shadow-[0_0_15px_rgba(0,229,255,0.4)] transition-all hover:-translate-y-0.5"
              >
                SUBSCRIBE
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} StoodoMart. All rights reserved.
          </p>
          <div className="flex items-center gap-4 opacity-60 mix-blend-luminosity grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">
            {/* Placeholder payment icons */}
            <div className="h-6 w-10 bg-white rounded flex items-center justify-center text-[8px] font-bold text-slate-900">VISA</div>
            <div className="h-6 w-10 bg-white rounded flex items-center justify-center text-[8px] font-bold text-slate-900">MC</div>
            <div className="h-6 w-10 bg-white rounded flex items-center justify-center text-[8px] font-bold text-slate-900">AMEX</div>
            <div className="h-6 w-10 bg-white rounded flex items-center justify-center text-[8px] font-bold text-slate-900">PAYPAL</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
