import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import CssBaseline from '@mui/material/CssBaseline';
import './index.css'
import App from './App.jsx'
import AuthProvider  from './context/AuthProvider.jsx'
import { SocketProvider } from './context/SocketContext.jsx';
import axios from 'axios';

// Ensure axios sends cookies for cross-site requests
axios.defaults.withCredentials = true;

// If a fallback JWT exists in localStorage (returned by backend) use it as Authorization header
const savedJwt = localStorage.getItem('jwt');
if (savedJwt) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${savedJwt}`;
}
createRoot(document.getElementById('root')).render(
    <AuthProvider>
     <SocketProvider>
       <App />
     </SocketProvider>
  </AuthProvider>
)
