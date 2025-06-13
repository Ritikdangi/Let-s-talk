import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/useAuth.jsx';
import AuthProvider from './context/AuthProvider';
import { SocketProvider } from './context/SocketContext';
import { SearchProvider } from './context/SearchContext';
import Dashboard from './pages/Dashboard';
import Signup from './components/auth/Signup';
import Login from './components/auth/Login';

function AppRoutes() {
  const [authUser, setAuthUser, loading] = useAuth();
    
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
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
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
          <SearchProvider>
            <AppRoutes />
          </SearchProvider>
        </SocketProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;