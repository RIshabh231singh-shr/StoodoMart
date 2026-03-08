import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function About() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-12 md:py-20 lg:max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-black mb-8 tracking-tight text-center">
          About Stoodo<span className="text-brand-red text-red-500">Mart</span>
        </h1>

        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-100 space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4 text-slate-800">Our Mission</h2>
            <p className="text-slate-600 leading-relaxed text-lg">
              StoodoMart is a dedicated marketplace designed exclusively for students. We understand the unique needs of college life, whether it's finding the right textbooks, scoring affordable hostel essentials, or discovering amazing deals on electronics. Our mission is to make student life easier and more affordable by connecting you with everything you need in one place.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-slate-800">Why Choose Us?</h2>
            <ul className="space-y-4 text-slate-600 text-lg">
              <li className="flex gap-3">
                <span className="text-teal-500 font-bold">✓</span>
                <span><strong>Curated for Students:</strong> Every category and product is selected with the student lifestyle in mind.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-teal-500 font-bold">✓</span>
                <span><strong>Campus Community:</strong> Buy and sell products directly within your college campus easily and securely.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-teal-500 font-bold">✓</span>
                <span><strong>Unbeatable Deals:</strong> We negotiate exclusive discounts just for registered students.</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-slate-800">Get in Touch</h2>
            <p className="text-slate-600 leading-relaxed text-lg">
              We're constantly evolving to better serve the student community. Have a suggestion or a question? Feel free to reach out to our support team any time!
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
