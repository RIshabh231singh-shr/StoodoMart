import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/login';

// A simple dummy Home component to show successful redirect
const Home = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <h1 className="text-4xl font-bold text-brand-teal">Welcome to StoodoMart Home!</h1>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}