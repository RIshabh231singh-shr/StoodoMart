import React, { useState } from "react";
import { Mail, MapPin, Phone, Send, CheckCircle, Clock } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate network request
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });

      // Reset success message after 5 seconds
      setTimeout(() => setIsSuccess(false), 5000);
    }, 1500);
  };

  return (
    <div className="min-h-screen font-sans flex flex-col bg-slate-50 text-slate-900">
      <Header />

      <main className="flex-grow pt-32 pb-20">

        {/* Page Header */}
        <div className="bg-slate-900 text-white py-16 md:py-24 relative overflow-hidden mb-16">
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-teal/20 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-red/20 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>

          <div className="container mx-auto px-4 md:px-8 max-w-5xl relative z-10 text-center">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Have a question about an order, a product, or just want to say hi?
              Our support team is here to help you out.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-8">

            {/* Contact Information Sidebar */}
            <div className="w-full lg:w-1/3 flex flex-col gap-6">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 h-full">
                <h3 className="text-2xl font-bold mb-8 pb-4 border-b border-slate-100 text-slate-800">Contact Info</h3>

                <div className="flex flex-col gap-8">
                  {/* Address */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-brand-teal/10 text-brand-teal flex items-center justify-center flex-shrink-0">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Our Location</h4>
                      <p className="font-semibold text-slate-800 leading-relaxed">Mega boys hotel 2<br />NIT Calicut<br />Kerala, India</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-brand-red/10 text-brand-red flex items-center justify-center flex-shrink-0">
                      <Phone size={24} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Phone Number</h4>
                      <p className="font-semibold text-slate-800">+91 9876543210</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center flex-shrink-0">
                      <Mail size={24} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Email Address</h4>
                      <p className="font-semibold text-slate-800">support@stoodomart.com</p>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                      <Clock size={24} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Working Hours</h4>
                      <p className="font-semibold text-slate-800">Mon - Fri: 9am - 6pm<br />Sat - Sun: 10am - 4pm</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="w-full lg:w-2/3">
              <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-slate-200 relative overflow-hidden">
                <h2 className="text-3xl font-black mb-2 text-slate-800">Send us a Message</h2>
                <p className="text-slate-500 mb-8">We usually respond within 24 hours.</p>

                {isSuccess ? (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl p-8 flex flex-col items-center justify-center text-center animate-fade-in">
                    <CheckCircle size={64} className="text-emerald-500 mb-4" />
                    <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                    <p className="text-emerald-700 font-medium">Thank you for reaching out. We will get back to you as soon as possible.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2">
                        <label htmlFor="name" className="text-sm font-bold text-slate-700">Full Name</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          required
                          className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent transition-all"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label htmlFor="email" className="text-sm font-bold text-slate-700">Email Address</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john@example.com"
                          required
                          className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label htmlFor="subject" className="text-sm font-bold text-slate-700">Subject</label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="How can we help you?"
                        required
                        className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent transition-all"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label htmlFor="message" className="text-sm font-bold text-slate-700">Message</label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Write your message here..."
                        required
                        rows="5"
                        className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent transition-all resize-y"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="mt-4 bg-slate-900 hover:bg-brand-teal text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-md hover:shadow-[0_8px_20px_rgba(0,229,255,0.3)] transform hover:-translate-y-1 flex items-center justify-center gap-3 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send size={18} /> Send Message
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
