import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { AuthContext } from './Createcontext.jsx';


function AuthProvider  ({ children }) {

  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        // Prefer JWT from cookie if present
        const jwtCookie = Cookies.get("token");
        let userData = null;
        if (jwtCookie){
          // Only decode JWT if needed (for fallback, not for backend auth)
          userData = { jwt: jwtCookie };
        } else {
          // Fallback to localStorage
          const local = localStorage.getItem("ChatApp");
          userData = local ? JSON.parse(local) : null;
        }
        setAuthUser(userData);
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

