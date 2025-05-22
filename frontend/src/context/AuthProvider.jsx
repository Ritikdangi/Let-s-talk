import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { AuthContext } from './Createcontext.jsx';


function AuthProvider  ({ children }) {
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = Cookies.get("token") || localStorage.getItem("ChatApp");
        console.log( "in auth provider" ,token)
        setAuthUser(token ? JSON.parse(token) : null);
        setLoading(false);
      } catch (error) {
        console.error("Auth error:", error);
        setAuthUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  return (
    <AuthContext.Provider value={[authUser, setAuthUser, loading]}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;

