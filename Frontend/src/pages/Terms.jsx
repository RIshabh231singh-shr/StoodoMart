import React, { useState } from "react";
import { Scale, FileText, Users, Handshake, AlertOctagon, HelpCircle, ShieldAlert, Menu } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const termsSections = [
  { id: "acceptance", title: "1. Acceptance of Terms", icon: Scale },
  { id: "user-accounts", title: "2. User Accounts", icon: Users },
  { id: "conduct", title: "3. Acceptable Use", icon: ShieldAlert },
  { id: "peer-to-peer", title: "4. Peer-to-Peer Trading", icon: Handshake },
  { id: "intellectual-property", title: "5. Intellectual Property", icon: FileText },
  { id: "limitations", title: "6. Limitation of Liability", icon: AlertOctagon },
  { id: "changes", title: "7. Modifications to Terms", icon: HelpCircle },
];

export default function Terms() {
  const [activeSection, setActiveSection] = useState("acceptance");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const scrollToSection = (id) => {
    setActiveSection(id);
    setIsSidebarOpen(false);
    const element = document.getElementById(id);
    if (element) {
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
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-orange/20 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
          
          <div className="container mx-auto px-4 md:px-8 max-w-6xl relative z-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-brand-orange text-sm font-bold uppercase tracking-wider mb-6">
                 <Scale size={16} /> Legal Information
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6">
                Terms of Service
              </h1>
              <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
                Please read these terms and conditions carefully before using the StoodoMart platform. 
                They outline your rights and responsibilities as a user of our campus marketplace.
              </p>
              <p className="text-sm text-slate-400 mt-6">Effective Date: October 24, 2024</p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-8 max-w-6xl relative">
          
          {/* Mobile Sidebar Toggle */}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 w-full mb-6 shadow-sm sticky top-24 z-20"
          >
            <Menu size={20} className={isSidebarOpen ? "text-brand-orange" : ""} />
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
                  {termsSections.map((section) => {
                    const Icon = section.icon;
                    const isActive = activeSection === section.id;
                    return (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                          isActive 
                            ? "bg-brand-orange/10 text-brand-orange font-bold" 
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium"
                        }`}
                      >
                        <Icon size={18} className={isActive ? "text-brand-orange" : "text-slate-400"} />
                        {section.title}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </aside>

            {/* Main Content Area */}
            <article className="w-full md:w-3/4 lg:w-3/4 max-w-3xl bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200 prose prose-slate prose-headings:font-black prose-h2:text-3xl prose-h2:mb-6 prose-p:text-slate-600 prose-p:leading-relaxed prose-a:text-brand-teal pb-20">
              
              <div className="bg-slate-50 border-l-4 border-brand-orange p-6 mb-12 rounded-r-xl">
                 <p className="m-0 text-slate-700 font-medium italic">
                   "By accessing or using StoodoMart, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service."
                 </p>
              </div>

              <section id="acceptance" className="scroll-mt-32 mb-16">
                 <h2>1. Acceptance of Terms</h2>
                 <p>Welcome to StoodoMart. By registering for an account, browsing the marketplace, or utilizing any services provided by StoodoMart, you are entering into a legally binding contract with us. These Terms of Service ("Terms") govern your use of the website, applications, and all related services.</p>
                 <p>We reserve the right to update or modify these Terms at any time without prior notice. Your continued use of the platform after any changes indicates your acceptance of the revised Terms.</p>
              </section>

              <section id="user-accounts" className="scroll-mt-32 mb-16">
                 <h2>2. User Accounts & Eligibility</h2>
                 <p>StoodoMart is primarily designed for college and university students. To use certain features, you must register for an account.</p>
                 <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-6">
                    <li>You must provide accurate, current, and complete information during the registration process.</li>
                    <li>You are responsible for safeguarding the password that you use to access the Service.</li>
                    <li>You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.</li>
                 </ul>
              </section>

              <section id="conduct" className="scroll-mt-32 mb-16">
                 <h2>3. Acceptable Use Policy</h2>
                 <p>You agree not to use StoodoMart to:</p>
                 <ul className="list-disc pl-6 space-y-2 text-slate-600">
                    <li>Post, list, or sell items that are illegal, counterfeit, stolen, or otherwise violate campus policies.</li>
                    <li>Engage in harassing, threatening, or abusive behavior toward other students.</li>
                    <li>Use the platform for money laundering or coordinated fraudulent activities.</li>
                    <li>Attempt to gain unauthorized access to the platform's backend, servers, or other user accounts.</li>
                 </ul>
                 <p className="mt-4 font-bold text-red-600">Violation of these rules will result in immediate permanent account termination without prior warning.</p>
              </section>

              <section id="peer-to-peer" className="scroll-mt-32 mb-16">
                 <h2>4. Peer-to-Peer Campus Trading</h2>
                 <p>A core feature of StoodoMart is the ability for students to buy and sell items directly with one another. When participating in this peer-to-peer marketplace, you acknowledge that:</p>
                 <div className="bg-slate-100 p-6 rounded-xl mt-6">
                   <p className="m-0 mb-4"><strong>StoodoMart is merely a venue:</strong> We do not hold inventory, inspect items, or mandate the pricing of student-listed goods.</p>
                   <p className="m-0 mb-4"><strong>No Warranties:</strong> Items sold by students are "AS-IS". StoodoMart provides no warranties or guarantees regarding the quality, safety, or legality of peer-listed items.</p>
                   <p className="m-0"><strong>Dispute Resolution:</strong> While we may provide tools to facilitate communication, StoodoMart is not directly responsible for resolving disputes between buyers and sellers in peer-to-peer transactions. Buyers should thoroughly inspect items in person before completing a transaction.</p>
                 </div>
              </section>

              <section id="intellectual-property" className="scroll-mt-32 mb-16">
                 <h2>5. Intellectual Property</h2>
                 <p>The Service and its original content (excluding user-generated listings), features, and functionality are and will remain the exclusive property of StoodoMart and its licensors. The Service is protected by copyright, trademark, and other laws.</p>
                 <p>Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of StoodoMart.</p>
              </section>

              <section id="limitations" className="scroll-mt-32 mb-16">
                 <h2>6. Limitation of Liability</h2>
                 <p>In no event shall StoodoMart, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:</p>
                 <ul className="list-disc pl-6 space-y-2 text-slate-600">
                    <li>Your access to or use of or inability to access or use the Service;</li>
                    <li>Any conduct or content of any third party on the Service;</li>
                    <li>Any content obtained from the Service; and</li>
                    <li>Unauthorized access, use or alteration of your transmissions or content.</li>
                 </ul>
              </section>

              <section id="changes" className="scroll-mt-32">
                 <h2>7. Modifications to the Service</h2>
                 <p>We reserve the right to withdraw or amend our Service, and any service or material we provide via the platform, in our sole discretion without notice. We will not be liable if for any reason all or any part of the Service is unavailable at any time or for any period.</p>
                 <div className="mt-8 border-t border-slate-200 pt-8">
                   <p className="text-sm text-slate-500 text-center">
                     If you have any questions about these Terms, please contact us at <a href="mailto:legal@stoodomart.com" className="font-bold">legal@stoodomart.com</a>.
                   </p>
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
