import React, { useState } from "react";
import { Shield, Eye, Database, Lock, UserCheck, Bell, MessageSquare, Menu } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

// Organized sections for easy navigation
const policySections = [
  { id: "introduction", title: "1. Introduction", icon: Shield },
  { id: "data-collection", title: "2. Information We Collect", icon: Database },
  { id: "data-usage", title: "3. How We Use Information", icon: Eye },
  { id: "sharing", title: "4. Sharing Information", icon: UserCheck },
  { id: "security", title: "5. Data Security", icon: Lock },
  { id: "communications", title: "6. Communications", icon: Bell },
  { id: "contact", title: "7. Contact Us", icon: MessageSquare },
];

export default function Privacy() {
  const [activeSection, setActiveSection] = useState("introduction");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const scrollToSection = (id) => {
    setActiveSection(id);
    setIsSidebarOpen(false); // Close mobile sidebar if open
    const element = document.getElementById(id);
    if (element) {
      // Offset for sticky header if you have one
      const offset = 120;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="min-h-screen font-sans flex flex-col bg-slate-50 text-slate-900">
      <Header />
      
      <main className="flex-grow pt-24 md:pt-32 pb-20">
        
        {/* Page Header */}
        <div className="bg-slate-900 text-white py-16 md:py-24 mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-teal/20 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
          
          <div className="container mx-auto px-4 md:px-8 max-w-6xl relative z-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-brand-teal text-sm font-bold uppercase tracking-wider mb-6">
                 <Shield size={16} /> Privacy First
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6">
                Privacy Policy
              </h1>
              <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
                At StoodoMart, we take your privacy seriously. This policy explains how we collect, use, and protect your personal information within our campus marketplace.
              </p>
              <p className="text-sm text-slate-400 mt-6">Last Updated: October 24, 2024</p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-8 max-w-6xl relative">
          
          {/* Mobile Sidebar Toggle */}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 w-full mb-6 shadow-sm sticky top-24 z-20"
          >
            <Menu size={20} className={isSidebarOpen ? "text-brand-teal" : ""} />
            {isSidebarOpen ? "Close Menu" : "Table of Contents"}
          </button>

          <div className="flex flex-col md:flex-row gap-8 lg:gap-12 relative items-start">
            
            {/* Sidebar Navigation */}
            <aside className={`
              ${isSidebarOpen ? "block" : "hidden"} 
              md:block w-full md:w-1/4 lg:w-1/4 shrink-0 
              md:sticky md:top-32
            `}>
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-800 tracking-wider uppercase text-sm mb-4">Contents</h3>
                <nav className="flex flex-col gap-1">
                  {policySections.map((section) => {
                    const Icon = section.icon;
                    const isActive = activeSection === section.id;
                    return (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                          isActive 
                            ? "bg-brand-teal/10 text-brand-teal font-bold" 
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium"
                        }`}
                      >
                        <Icon size={18} className={isActive ? "text-brand-teal" : "text-slate-400"} />
                        {section.title}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </aside>

            {/* Main Content Area */}
            <article className="w-full md:w-3/4 lg:w-3/4 max-w-3xl bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200 prose prose-slate prose-headings:font-black prose-h2:text-3xl prose-h2:mb-6 prose-p:text-slate-600 prose-p:leading-relaxed prose-a:text-brand-teal pb-20">
              
              <section id="introduction" className="scroll-mt-32 mb-16">
                 <h2>1. Introduction</h2>
                 <p>Welcome to StoodoMart ("we", "our", or "us"). We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website (regardless of where you visit it from) or use our campus marketplace application.</p>
                 <p>StoodoMart is built exclusively for students. By using the Service, you agree to the collection and use of information in accordance with this Privacy Policy.</p>
              </section>

              <section id="data-collection" className="scroll-mt-32 mb-16">
                 <h2>2. Information We Collect</h2>
                 <p>We collect several different types of information for various purposes to provide and improve our Service to you:</p>
                 <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-6">
                    <li><strong>Personal Data:</strong> Email address, First name and Last name, Phone number, Address, State, Province, ZIP/Postal code, City.</li>
                    <li><strong>Account Data:</strong> We may require verification of your student status (e.g., college ID photo or .edu email address) to maintain the security of the campus marketplace.</li>
                    <li><strong>Transaction Data:</strong> Details about payments to and from you and other details of products you have purchased or sold through the platform.</li>
                    <li><strong>Usage Data:</strong> Information on how the Service is accessed and used, including IP addresses, browser types, browser versions, and the pages of our Service that you visit.</li>
                 </ul>
              </section>

              <section id="data-usage" className="scroll-mt-32 mb-16">
                 <h2>3. How We Use Your Information</h2>
                 <p>We use the collected data for various purposes, including:</p>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p className="m-0 text-sm font-semibold text-slate-800">To Provide Service</p>
                      <p className="m-0 text-xs text-slate-500 mt-1">To maintain our Service and process your transactions.</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p className="m-0 text-sm font-semibold text-slate-800">To Notify You</p>
                      <p className="m-0 text-xs text-slate-500 mt-1">About changes to our Service or updates on orders/messages.</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p className="m-0 text-sm font-semibold text-slate-800">Customer Support</p>
                      <p className="m-0 text-xs text-slate-500 mt-1">To provide customer care and answer inquiries.</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p className="m-0 text-sm font-semibold text-slate-800">Platform Safety</p>
                      <p className="m-0 text-xs text-slate-500 mt-1">To monitor usage and detect, prevent, and address technical or safety issues.</p>
                    </div>
                 </div>
              </section>

              <section id="sharing" className="scroll-mt-32 mb-16">
                 <h2>4. Sharing Information (Peer-to-Peer)</h2>
                 <p>Because StoodoMart facilitates peer-to-peer campus trading, certain information is shared with other users:</p>
                 <ul className="list-disc pl-6 space-y-2 text-slate-600">
                    <li><strong>Public Profile:</strong> Your first name, profile picture (if uploaded), and active listings are visible to other logged-in students.</li>
                    <li><strong>Transaction Matches:</strong> When you agree to buy or sell an item with another student, we share your preferred contact method (which you set) so you can arrange a meetup on campus.</li>
                    <li><strong>No Sale of Data:</strong> We <em>do not</em> sell your personal data to third-party marketers or data brokers under any circumstances.</li>
                 </ul>
              </section>

              <section id="security" className="scroll-mt-32 mb-16">
                 <h2>5. Data Security</h2>
                 <p>The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.</p>
                 <p>All payment transactions run through established, secure third-party payment gateways; we do not store your raw credit card data on our servers.</p>
              </section>

              <section id="communications" className="scroll-mt-32 mb-16">
                 <h2>6. Communications</h2>
                 <p>We may use your Personal Data to contact you with newsletters, marketing or promotional materials, and other information that may be of interest to you. You may opt out of receiving any, or all, of these communications from us by following the unsubscribe link or instructions provided in any email we send.</p>
                 <p>Note: You cannot opt out of critical transactional emails (like order summaries or account security alerts).</p>
              </section>

              <section id="contact" className="scroll-mt-32">
                 <h2>7. Contact Us</h2>
                 <p>If you have any questions about this Privacy Policy or how we handle your data, please contact us:</p>
                 <div className="bg-slate-900 text-white p-6 rounded-2xl flex flex-col sm:flex-row gap-6 items-center mt-6">
                   <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                     <MessageSquare className="text-brand-teal" />
                   </div>
                   <div className="flex-grow text-center sm:text-left">
                     <p className="font-bold text-lg m-0">Privacy Officer</p>
                     <p className="text-slate-300 text-sm m-0 mt-1">Email: privacy@stoodomart.com</p>
                   </div>
                   <Link to="/contact" className="px-6 py-2 bg-brand-teal text-slate-900 font-bold rounded-xl hover:bg-emerald-400 transition-colors whitespace-nowrap">
                     Contact Support
                   </Link>
                 </div>
              </section>

            </article>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
