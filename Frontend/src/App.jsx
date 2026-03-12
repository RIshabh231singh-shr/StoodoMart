import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { CheckAuthThunk } from './Authslice';
import { fetchCart } from './CartSlice';
import Login from './pages/login';
import Signup from './pages/signup';
import Profile from './pages/Profile';
import UpdateProfile from './pages/UpdateProfile';
import AddProduct from './pages/AddProduct';
import Home from './pages/Home';
import About from './pages/About';
import CategoryPage from './pages/CategoryPage';
import AdminRequests from './pages/AdminRequests';
import AllProfiles from './pages/AllProfiles';
import SuperAdminUpdateProfile from './pages/SuperAdminUpdateProfile';
import MyProducts from './pages/MyProducts';
import UpdateProduct from './pages/UpdateProduct';
import Shop from './pages/Shop';
import Deals from './pages/Deals';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import BuyAndSell from './pages/BuyAndSell';
import Returns from './pages/Returns';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import MyOrders from './pages/MyOrders';
import PlaceOrder from './pages/PlaceOrder';
import AdminOrders from './pages/AdminOrders';
import Categories from './pages/Categories';

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
  const { loading, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(CheckAuthThunk());
  }, [dispatch]);

  // Load cart once authenticated
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [isAuthenticated, dispatch]);

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
        <Route path="/shop" element={<Shop />} />
        <Route path="/deals" element={<Deals />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/buy-and-sell" element={<BuyAndSell />} />
        <Route path="/returns" element={<Returns />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/about" element={<About />} />
        <Route path="/categories" element={<Navigate to="/shop" replace />} />
        <Route path="/category/:slug" element={<Navigate to="/shop" replace />} />
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
          path="/my-orders"
          element={<MyOrders />}
        />
        <Route
          path="/checkout"
          element={<PlaceOrder />}
        />
        <Route
          path="/admin/orders"
          element={
            <AdminRoute>
              <AdminOrders />
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
          path="/superadmin/requests"
          element={
            <SuperAdminRoute>
              <AdminRequests />
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