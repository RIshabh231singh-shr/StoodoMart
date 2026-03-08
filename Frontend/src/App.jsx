import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { CheckAuthThunk } from './Authslice';
import Login from './pages/login';
import Signup from './pages/signup';
import Profile from './pages/Profile';
import UpdateProfile from './pages/UpdateProfile';
import AddProduct from './pages/AddProduct';
import Home from './pages/Home';

// ProtectedAuthRoute ensures logged-in users cannot access Login/Signup pages
const ProtectedAuthRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

export default function App() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(CheckAuthThunk());
  }, [dispatch]);

  // If loading the initial auth state, show a generic full-page loader or return null to prevent flash
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-brand-teal border-solid"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/update-profile" element={<UpdateProfile />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route 
          path="/login" 
          element={
            <ProtectedAuthRoute>
              <Login />
            </ProtectedAuthRoute>
          } 
        />
        <Route 
          path="/signup" 
          element={
            <ProtectedAuthRoute>
              <Signup />
            </ProtectedAuthRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}