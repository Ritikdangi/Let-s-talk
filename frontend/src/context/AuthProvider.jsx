import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { AuthContext } from './Createcontext.jsx';


function AuthProvider  ({ children }) {

  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First try backend /me endpoint (works if cookie or Authorization header is present)
        const API_URL = import.meta.env.VITE_API_URL;
        try {
          const meResp = await axios.get(`${API_URL}/api/auth/me`, { withCredentials: true });
          if (meResp?.data?.user) {
            setAuthUser(meResp.data.user);
            setLoading(false);
            return;
          }
        } catch (e) {
          // ignore and fallback to cookie/localStorage
        }

        // Prefer JWT from cookie if present
        const jwtCookie = Cookies.get("token");
        let userData = null;
        if (jwtCookie) {
          // Only store the token (we can't read httpOnly cookie contents directly)
          userData = { jwt: jwtCookie };
        } else {
          // Fallback to localStorage: support either a JSON `ChatApp` object or a plain `jwt` string
          const chatAppRaw = localStorage.getItem("ChatApp");
          const jwtLocal = localStorage.getItem('jwt');
          if (chatAppRaw) {
            try {
              userData = JSON.parse(chatAppRaw);
            } catch (e) {
              console.warn('Failed to parse ChatApp from localStorage', e);
              userData = null;
            }
          } else if (jwtLocal) {
            userData = { jwt: jwtLocal };
          } else {
            userData = null;
          }
        }
        setAuthUser(userData);
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

