import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, Link } from 'react-router';
import axiosClient from '../utility/axios';
import logo from '../assets/logo.png';
import { Loader2 } from 'lucide-react';

const emailSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
});

const resetSchema = z.object({
  otp: z.string().length(6, 'OTP must be exactly 6 digits'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1 = Request OTP, 2 = Verify OTP & Reset
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [userEmail, setUserEmail] = useState('');

  const navigate = useNavigate();

  const { register: registerEmail, handleSubmit: handleEmailSubmit, formState: { errors: emailErrors } } = useForm({
    resolver: zodResolver(emailSchema),
  });

  const { register: registerReset, handleSubmit: handleResetSubmit, formState: { errors: resetErrors } } = useForm({
    resolver: zodResolver(resetSchema),
  });

  const onEmailSubmit = async (data) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await axiosClient.post('/person/forgot-password', { email: data.email });
      setUserEmail(data.email);
      setSuccess(res.data.message || 'OTP sent to your email.');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const onResetSubmit = async (data) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await axiosClient.post('/person/reset-password', {
        email: userEmail,
        otp: data.otp,
        newPassword: data.newPassword,
      });
      setSuccess(res.data.message || 'Password reset successful!');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-mesh-gradient animate-gradient-bg p-8 overflow-hidden relative before:absolute before:rounded-full before:blur-[80px] before:opacity-60 before:w-[400px] before:h-[400px] before:bg-brand-teal before:-top-[100px] before:-left-[100px] before:animate-float after:absolute after:rounded-full after:blur-[80px] after:opacity-60 after:w-[500px] after:h-[500px] after:bg-brand-red after:-bottom-[150px] after:-right-[100px] after:animate-float-reverse">
      <div className="relative z-10 bg-white/85 backdrop-blur-md border border-white/40 rounded-3xl p-8 sm:p-12 w-full max-w-[450px] shadow-2xl animate-slide-up">
        
        <div className="flex flex-col items-center mb-8">
          <Link to="/">
            <img src={logo} alt="StoodoMart Logo" className="w-20 h-auto mb-4 drop-shadow-md transition-transform duration-300 hover:scale-105 hover:-rotate-3" />
          </Link>
          <h1 className="text-3xl font-extrabold text-[#1a1a2e] m-0 tracking-tight">Recover <span className="text-brand-red">Access</span></h1>
        </div>
        
        <p className="text-center text-slate-500 text-[0.95rem] mb-6">
          {step === 1 ? 'Enter your email to receive a password reset OTP.' : 'Enter your OTP and new password.'}
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-xl text-sm font-medium border border-red-200 text-center">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-emerald-100 text-emerald-800 rounded-xl text-sm font-medium border border-emerald-200 text-center">
            {success}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleEmailSubmit(onEmailSubmit)} className="flex flex-col">
            <div className="mb-6 relative group">
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2 transition-colors duration-300 group-focus-within:text-[#00B4DB]">Email address</label>
              <input 
                type="email" 
                id="email"
                className={`w-full px-5 py-3.5 text-base text-slate-800 bg-white/90 border-2 rounded-xl outline-none transition-all duration-300 placeholder:text-slate-400 focus:ring-4 focus:bg-white ${
                  emailErrors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500/15' : 'border-slate-200 focus:border-brand-teal focus:ring-brand-teal/15'
                }`}
                placeholder="Enter your registered email"
                {...registerEmail('email')}
              />
              {emailErrors.email && <p className="mt-2 text-sm text-red-500">{emailErrors.email.message}</p>}
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full p-4 mt-2 text-base font-bold text-white bg-gradient-to-br from-brand-red to-brand-orange rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Send OTP'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleResetSubmit(onResetSubmit)} className="flex flex-col">
            <div className="mb-6 relative group">
              <label htmlFor="otp" className="block text-sm font-semibold text-slate-700 mb-2 transition-colors duration-300 group-focus-within:text-[#00B4DB]">6-Digit OTP</label>
              <input 
                type="text" 
                id="otp"
                maxLength="6"
                className={`w-full px-5 py-3.5 text-base text-center tracking-[0.5em] font-bold text-slate-800 bg-white/90 border-2 rounded-xl outline-none transition-all duration-300 placeholder:tracking-normal placeholder:font-normal placeholder:text-slate-400 focus:ring-4 focus:bg-white ${
                  resetErrors.otp ? 'border-red-500 focus:border-red-500 focus:ring-red-500/15' : 'border-slate-200 focus:border-brand-teal focus:ring-brand-teal/15'
                }`}
                placeholder="123456"
                {...registerReset('otp')}
              />
              {resetErrors.otp && <p className="mt-2 text-sm text-red-500 text-left">{resetErrors.otp.message}</p>}
            </div>

            <div className="mb-8 relative group">
              <label htmlFor="newPassword" className="block text-sm font-semibold text-slate-700 mb-2 transition-colors duration-300 group-focus-within:text-[#00B4DB]">New Password</label>
              <input 
                type="password" 
                id="newPassword"
                className={`w-full px-5 py-3.5 text-base text-slate-800 bg-white/90 border-2 rounded-xl outline-none transition-all duration-300 placeholder:text-slate-400 focus:ring-4 focus:bg-white ${
                  resetErrors.newPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-500/15' : 'border-slate-200 focus:border-brand-teal focus:ring-brand-teal/15'
                }`}
                placeholder="New strong password"
                {...registerReset('newPassword')}
              />
              {resetErrors.newPassword && <p className="mt-2 text-sm text-red-500">{resetErrors.newPassword.message}</p>}
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full p-4 text-base font-bold text-white bg-gradient-to-br from-brand-teal to-brand-green rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Reset Password'}
            </button>
          </form>
        )}

        <div className="mt-8 text-center text-[0.95rem] text-slate-600">
          Remember your password? 
          <Link to="/login" className="font-bold text-brand-teal hover:text-brand-green no-underline ml-2 transition-colors">Login</Link>
        </div>
        
      </div>
    </div>
  );
}
