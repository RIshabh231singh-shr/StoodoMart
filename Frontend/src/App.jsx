import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { useSelector } from 'react-redux';
import Login from './pages/login';
import Signup from './pages/signup';

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
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
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