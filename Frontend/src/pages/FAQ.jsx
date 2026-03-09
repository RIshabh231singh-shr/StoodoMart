import React, { useState } from "react";
import { Link } from "react-router";
import { ChevronDown, HelpCircle, MessageCircle, Phone, Mail } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const faqs = [
  {
    category: "General Information",
    questions: [
      {
        q: "What is StoodoMart?",
        a: "StoodoMart is an exclusive marketplace designed specifically for college students. We connect students with everything they need for campus life, from textbooks and electronics to hostel essentials, all at guaranteed discounted rates."
      },
      {
        q: "Do I need to be a student to buy things?",
        a: "Yes, our exclusive deals and features are tailored for the student community. You will need a valid student ID or university email address to access our best offers."
      },
      {
        q: "How does the 'Can buy and sell your products within college' feature work?",
        a: "We allow students to list their used textbooks, electronics, and hostel items for sale to other students on the same campus, making it easy and safe to exchange goods without shipping fees."
      }
    ]
  },
  {
    category: "Orders & Shipping",
    questions: [
      {
        q: "How long does delivery take?",
        a: "For products sold by local students on your campus, delivery is typically arranged in-person on the same day. For brand new products ordered from our premium catalog, standard shipping takes 3-5 business days."
      },
      {
        q: "Can I track my order?",
        a: "Absolutely! Once your order from our premium catalog is shipped, you will receive a tracking link via email and on your profile's 'My Orders' page."
      },
      {
        q: "What happens if an item is out of stock?",
        a: "If a premium item is out of stock, it will be marked accordingly. You can add it to your wishlist, and we will notify you as soon as it becomes available again."
      }
    ]
  },
  {
    category: "Returns & Refunds",
    questions: [
      {
        q: "What is your return policy?",
        a: "We offer a 7-day hassle-free return policy for any unused or defective premium products. Peer-to-peer student sales are final unless the item was significantly misrepresented."
      },
      {
        q: "How do I request a refund?",
        a: "To request a refund, go to 'My Orders' in your profile, select the item, and click 'Request Return'. Our support team will guide you through the process."
      }
    ]
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen font-sans flex flex-col bg-slate-50 text-slate-900">
      <Header />

      <main className="flex-grow pt-32 pb-20">

        {/* Page Header */}
        <div className="bg-slate-900 text-white py-16 md:py-24 mb-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-teal/20 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
          <div className="container mx-auto px-4 md:px-8 max-w-4xl text-center relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md mb-6 shadow-xl border border-white/20">
              <HelpCircle size={32} className="text-brand-teal" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Find answers to the most common questions about StoodoMart, our products, shipping, and peer-to-peer selling.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-8 max-w-4xl">

          {/* FAQ Accordion */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-10 mb-16">
            {faqs.map((group, groupIndex) => (
              <div key={groupIndex} className="mb-10 last:mb-0">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3 border-b border-slate-100 pb-4">
                  <span className="w-8 h-8 rounded-lg bg-brand-teal/10 text-brand-teal flex items-center justify-center text-sm">
                    {groupIndex + 1}
                  </span>
                  {group.category}
                </h2>

                <div className="space-y-4">
                  {group.questions.map((faq, index) => {
                    // Create a unique index for the entire flat list so only one opens at a time 
                    // (or we can use local state if we want multiple open)
                    const absoluteIndex = `${groupIndex}-${index}`;
                    const isOpen = openIndex === absoluteIndex;

                    return (
                      <div
                        key={index}
                        className={`border rounded-2xl transition-all duration-300 overflow-hidden ${isOpen
                            ? "border-brand-teal bg-brand-teal/5 shadow-md"
                            : "border-slate-200 hover:border-slate-300 bg-white"
                          }`}
                      >
                        <button
                          className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                          onClick={() => toggleAccordion(absoluteIndex)}
                        >
                          <span className={`font-semibold pr-8 text-lg ${isOpen ? "text-brand-teal" : "text-slate-800"}`}>
                            {faq.q}
                          </span>
                          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? "bg-brand-teal text-white rotate-180" : "bg-slate-100 text-slate-500"
                            }`}>
                            <ChevronDown size={18} />
                          </div>
                        </button>

                        <div
                          className={`transition-all duration-300 ease-in-out px-5 overflow-hidden ${isOpen ? "max-h-96 pb-6 opacity-100" : "max-h-0 opacity-0"
                            }`}
                        >
                          <p className="text-slate-600 leading-relaxed border-t border-brand-teal/10 pt-4">
                            {faq.a}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Still have questions block */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 md:p-12 text-center text-white shadow-xl relative overflow-hidden">

            {/* Decorative lines */}
            <div className="absolute top-0 right-0 p-8 opacity-10 blur-sm pointer-events-none">
              <MessageCircle size={120} />
            </div>

            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">Still have questions?</h3>
              <p className="text-slate-300 mb-8 max-w-lg mx-auto">
                Can't find the answer you're looking for? Our student support team is ready to help you out.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/contact"
                  className="w-full sm:w-auto px-8 py-3 bg-brand-teal hover:bg-emerald-400 text-slate-900 font-bold rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:shadow-[0_0_30px_rgba(0,229,255,0.5)] transform hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                  <Mail size={18} /> Contact Support
                </Link>
                <a
                  href="tel:+919876543210"
                  className="w-full sm:w-auto px-8 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-bold rounded-full transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Phone size={18} /> Call Us
                </a>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
