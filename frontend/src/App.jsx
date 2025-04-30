import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthProvider';
import Dashboard from './pages/Dashboard';
import Signup from './components/auth/Signup';
import Login from './components/auth/Login';

function App() {
  const [authUser, setAuthUser] = useAuth(); // Array destructuring
    console.log(" authuser after login / signup " , authUser);
  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/register" 
          element={authUser ? <Navigate to="/"  /> : <Signup />} 
        />
        <Route 
          path="/login" 
          element={authUser ? <Navigate to="/"  /> : <Login />} 
        />
        <Route 
          path="/" 
          element={authUser ? <Dashboard /> : <Navigate to="/login"  />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;