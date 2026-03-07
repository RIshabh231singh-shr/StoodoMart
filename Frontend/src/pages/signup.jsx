import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { RegisterUser } from '../Authslice';
import logo from '../assets/logo.png';

// Define the validation schema using Zod
const signupSchema = z.object({
  firstname: z.string().min(2, 'First name must be at least 2 characters'),
  lastname: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Confirm password is required'),
}).refine((data) => data.password === data.confirmPassword, {
  path: ['confirmPassword'],
  message: "Passwords don't match",
});

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // Redirect to home if successfully registered & authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (data) => {
    // Exclude confirmPassword and append a default role if needed by backend.
    const { confirmPassword, ...registerData } = data;
    registerData.role = 'User'; // Default role (adjust if your backend expects something else)
    
    dispatch(RegisterUser(registerData));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-mesh-gradient animate-gradient-bg p-8 overflow-hidden relative before:content-[''] before:absolute before:rounded-full before:blur-[80px] before:z-0 before:opacity-60 before:w-[400px] before:h-[400px] before:bg-brand-teal before:-top-[100px] before:-left-[100px] before:animate-float after:content-[''] after:absolute after:rounded-full after:blur-[80px] after:z-0 after:opacity-60 after:w-[500px] after:h-[500px] after:bg-brand-red after:-bottom-[150px] after:-right-[100px] after:animate-float-reverse">
      <div className="relative z-10 bg-white/85 backdrop-blur-md border border-white/40 rounded-3xl p-8 sm:p-12 w-full max-w-[500px] shadow-2xl opacity-0 translate-y-[30px] animate-slide-up my-8">
        
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="StoodoMart Logo" className="w-16 h-auto mb-3 drop-shadow-md transition-transform duration-300 hover:scale-105 hover:-rotate-3" />
          <h1 className="text-2xl font-extrabold text-[#1a1a2e] m-0 tracking-tight">Stoodo<span className="text-brand-red">Mart</span></h1>
        </div>
        
        <p className="text-center text-slate-500 text-[0.95rem] mb-6">Create your account to get started.</p>

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-xl text-sm font-medium border border-red-200">
            {typeof error === 'string' ? error : error?.message || 'Registration failed'}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="signup-form">
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div className="relative group">
              <label htmlFor="firstname" className="block text-sm font-semibold text-slate-700 mb-1.5 transition-colors duration-300 group-focus-within:text-[#00B4DB]">First Name</label>
              <input 
                type="text" 
                id="firstname"
                className={`w-full px-4 py-3 text-base text-slate-800 bg-white/90 border-2 rounded-xl outline-none transition-all duration-300 placeholder:text-slate-400 focus:ring-4 focus:bg-white ${
                  errors.firstname ? 'border-red-500 focus:border-red-500 focus:ring-red-500/15' : 'border-slate-200 focus:border-brand-teal focus:ring-brand-teal/15'
                }`}
                placeholder="Rishabh"
                {...register('firstname')}
              />
              {errors.firstname && (
                <p className="mt-1 text-xs text-red-500 font-medium">{errors.firstname.message}</p>
              )}
            </div>

            <div className="relative group">
              <label htmlFor="lastname" className="block text-sm font-semibold text-slate-700 mb-1.5 transition-colors duration-300 group-focus-within:text-[#00B4DB]">Last Name</label>
              <input 
                type="text" 
                id="lastname"
                className={`w-full px-4 py-3 text-base text-slate-800 bg-white/90 border-2 rounded-xl outline-none transition-all duration-300 placeholder:text-slate-400 focus:ring-4 focus:bg-white ${
                  errors.lastname ? 'border-red-500 focus:border-red-500 focus:ring-red-500/15' : 'border-slate-200 focus:border-brand-teal focus:ring-brand-teal/15'
                }`}
                placeholder="Singh"
                {...register('lastname')}
              />
              {errors.lastname && (
                <p className="mt-1 text-xs text-red-500 font-medium">{errors.lastname.message}</p>
              )}
            </div>
          </div>

          <div className="mb-5 relative group">
            <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5 transition-colors duration-300 group-focus-within:text-[#00B4DB]">Email address</label>
            <input 
              type="email" 
              id="email"
              className={`w-full px-4 py-3 text-base text-slate-800 bg-white/90 border-2 rounded-xl outline-none transition-all duration-300 placeholder:text-slate-400 focus:ring-4 focus:bg-white ${
                errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500/15' : 'border-slate-200 focus:border-brand-teal focus:ring-brand-teal/15'
              }`}
              placeholder="rishabh@example.com"
              {...register('email')}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500 font-medium">{errors.email.message}</p>
            )}
          </div>

          <div className="mb-5 relative group">
            <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-1.5 transition-colors duration-300 group-focus-within:text-[#00B4DB]">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                id="password"
                className={`w-full px-4 py-3 text-base text-slate-800 bg-white/90 border-2 rounded-xl outline-none transition-all duration-300 placeholder:text-slate-400 focus:ring-4 focus:bg-white pr-10 ${
                  errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500/15' : 'border-slate-200 focus:border-brand-teal focus:ring-brand-teal/15'
                }`}
                placeholder="••••••••"
                {...register('password')}
              />
              <button 
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-brand-teal transition-colors focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-500 font-medium">{errors.password.message}</p>
            )}
          </div>

          <div className="mb-8 relative group">
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700 mb-1.5 transition-colors duration-300 group-focus-within:text-[#00B4DB]">Confirm Password</label>
            <div className="relative">
              <input 
                type={showConfirmPassword ? "text" : "password"} 
                id="confirmPassword"
                className={`w-full px-4 py-3 text-base text-slate-800 bg-white/90 border-2 rounded-xl outline-none transition-all duration-300 placeholder:text-slate-400 focus:ring-4 focus:bg-white pr-10 ${
                  errors.confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-500/15' : 'border-slate-200 focus:border-brand-teal focus:ring-brand-teal/15'
                }`}
                placeholder="••••••••"
                {...register('confirmPassword')}
              />
              <button 
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-brand-teal transition-colors focus:outline-none"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              >
                {showConfirmPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-500 font-medium">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button 
            type="submit" 
            disabled={loading || isSubmitting}
            className="w-full p-3.5 text-base font-bold text-white bg-gradient-to-br from-brand-red to-brand-orange border-none rounded-xl cursor-pointer transition-all duration-300 shadow-[0_4px_15px_rgba(255,75,43,0.4)] relative overflow-hidden hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(255,75,43,0.5)] active:translate-y-[1px] disabled:opacity-70 disabled:cursor-not-allowed after:content-[''] after:absolute after:top-0 after:-left-full after:w-full after:h-full after:bg-gradient-to-r after:from-transparent after:via-white/20 after:to-transparent after:transition-all after:duration-500 hover:after:left-full flex justify-center items-center"
          >
            {loading ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : 'Create Account'}
          </button>
        </form>

        <div className="mt-8 text-center text-[0.95rem] text-slate-600">
          Already have an account? 
          <a href="/login" className="font-bold text-brand-red no-underline ml-2 relative after:content-[''] after:absolute after:w-full after:h-[2px] after:-bottom-[2px] after:left-0 after:bg-brand-red after:scale-x-0 after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">Log in</a>
        </div>
        
      </div>
    </div>
  );
}
