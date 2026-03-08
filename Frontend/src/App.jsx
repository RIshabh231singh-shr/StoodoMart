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
import About from './pages/About';
import CategoryPage from './pages/CategoryPage';
import AllProfiles from './pages/AllProfiles';
import SuperAdminUpdateProfile from './pages/SuperAdminUpdateProfile';
import MyProducts from './pages/MyProducts';
import UpdateProduct from './pages/UpdateProduct';

// ProtectedAuthRoute ensures logged-in users cannot access Login/Signup pages
const ProtectedAuthRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// AdminRoute ensures only users with Admin or SuperAdmin role can access the route
const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);
  
  if (loading) return null;

  if (!isAuthenticated || (user?.role !== "SuperAdmin" && user?.role !== "Admin")) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// SuperAdminRoute ensures only users with SuperAdmin role can access the route
const SuperAdminRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);
  
  if (loading) return null;

  if (!isAuthenticated || user?.role !== "SuperAdmin") {
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

  if (loading) {
    return (
      <div className="flex min-h-screen justify-center items-center bg-slate-50 absolute inset-0 z-50 p-6">
         <div className="animate-pulse flex gap-5 w-full max-w-sm">
            <div className="h-16 w-16 bg-slate-200 rounded-full flex-shrink-0"></div>
            <div className="flex flex-col gap-3 flex-1 justify-center">
              <div className="h-4 w-3/4 bg-slate-200 rounded"></div>
              <div className="h-4 w-1/2 bg-slate-200 rounded"></div>
            </div>
         </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/update-profile" element={<UpdateProfile />} />
        <Route 
          path="/add-product" 
          element={
            <AdminRoute>
              <AddProduct />
            </AdminRoute>
          } 
        />
        <Route 
          path="/my-products" 
          element={
            <AdminRoute>
              <MyProducts />
            </AdminRoute>
          } 
        />
        <Route 
          path="/update-product/:id" 
          element={
            <AdminRoute>
              <UpdateProduct />
            </AdminRoute>
          } 
        />
        <Route 
          path="/superadmin/all-profiles" 
          element={
            <SuperAdminRoute>
              <AllProfiles />
            </SuperAdminRoute>
          } 
        />
        <Route 
          path="/superadmin/update-profile/:id" 
          element={
            <SuperAdminRoute>
              <SuperAdminUpdateProfile />
            </SuperAdminRoute>
          } 
        />
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