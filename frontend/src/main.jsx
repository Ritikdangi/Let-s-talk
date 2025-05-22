import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import CssBaseline from '@mui/material/CssBaseline';
import './index.css'
import App from './App.jsx'
import AuthProvider  from './context/AuthProvider.jsx'
import { SocketProvider } from './context/SocketContext.jsx';
createRoot(document.getElementById('root')).render(
    <AuthProvider>
     <SocketProvider>
       <App />
     </SocketProvider>
  </AuthProvider>
)
