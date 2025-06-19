import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router';
import { CiLogout } from "react-icons/ci";
import Cookies from 'js-cookie';
import { useAuth } from '../../context/useAuth.jsx';
import { useSocket } from '../../context/useSocket.jsx';

function Logout() {
    const Navigate = useNavigate();
    const [authUser, setAuthUser] = useAuth();
    const { socket } = useSocket();
    const API_URL = import.meta.env.VITE_API_URL;

    const submitHandler = async () => {
        try {
            // First disconnect socket
            if (socket) {
                socket.disconnect();
            }

            // Then logout from server
            await axios.post(`${API_URL}/api/auth/logout`, {}, {
                withCredentials: true
            });

            // Clear local storage and cookies
            localStorage.removeItem("ChatApp");
            Cookies.remove("token");
            
            // Finally update auth state
            setAuthUser(null);
            
            alert("Logged out successfully");
            Navigate('/login');
        } catch (e) {
            console.log("error in logged out ", e.message);
        }
    }

    return (
        <div className='max-h-[10vh] flex items-center mt-3 gap-4 ml-5 text-white '>
            <div className="font-semibold">
                Logout
            </div>
            <button onClick={submitHandler}>
                <CiLogout className="text-3xl"/>
            </button>
        </div>
    )
}

export default Logout
