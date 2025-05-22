import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/useAuth.jsx';
import Dashboard from './pages/Dashboard';
import Signup from './components/auth/Signup';
import Login from './components/auth/Login';

function App() {
  const [authUser, setAuthUser , loading] = useAuth();
   
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/register" 
          element={authUser ? <Navigate to="/" /> : <Signup />} 
        />
        <Route 
          path="/login" 
          element={authUser ? <Navigate to="/" /> : <Login />} 
        />
        <Route 
          path="/" 
          element={authUser ? <Dashboard /> : <Navigate to="/login" />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;