import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router';
import { CiLogout } from "react-icons/ci";
import { AiOutlineEdit } from 'react-icons/ai';
import Cookies from 'js-cookie';
import { useAuth } from '../../context/useAuth.jsx';
import { useSocket } from '../../context/useSocket.jsx';
import { useState } from 'react';

function Logout() {
    const Navigate = useNavigate();
    const [authUser, setAuthUser] = useAuth();
    const { socket } = useSocket();
    const API_URL = import.meta.env.VITE_API_URL;
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({ name: authUser?.name || '', email: authUser?.email || '', password: '' });

    const onChange = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

    const submitProfile = async () => {
        try {
            const res = await axios.put(`${API_URL}/api/auth/me`, { name: form.name, email: form.email, password: form.password }, { withCredentials: true });
            if (res?.data?.user) {
                // update local auth state and localStorage
                const updated = res.data.user;
                localStorage.setItem('ChatApp', JSON.stringify(updated));
                setAuthUser(updated);
                alert('Profile updated');
                setEditing(false);
                setForm(prev => ({ ...prev, password: '' }));
            } else {
                alert(res?.data?.message || 'Update failed');
            }
        } catch (e) {
            console.error('Profile update failed', e?.response?.data || e.message || e);
            alert('Profile update failed: ' + (e?.response?.data?.message || e.message || 'error'));
        }
    };

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
            // also remove lastConversation so next visitor doesn't inherit it
            localStorage.removeItem('lastConversation');
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
        <div className='w-full flex flex-col sm:flex-row items-center sm:items-center gap-3 mt-3 ml-2 mr-2 text-white'>
            <div className='flex items-center gap-3 w-full'>
                {/* Avatar + name block */}
                <div className='flex items-center gap-3 min-w-0'>
                    <div className='w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-semibold flex-shrink-0'>
                        {authUser?.name ? authUser.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className='flex-1 min-w-0'>
                        <div className='font-semibold text-sm truncate'>{authUser?.name || 'You'}</div>
                    <div className='text-xs text-gray-300 truncate'>{authUser?.email || ''}</div>
                    </div>
                </div>

                {/* Actions */}
                <div className='flex items-center gap-2 sm:gap-3 flex-shrink-0'>
                    <button type="button" onClick={() => setEditing(true)} className='flex items-center gap-2 px-2 py-1 rounded bg-slate-700 hover:bg-slate-600 text-sm whitespace-nowrap'>
                        <AiOutlineEdit className='text-base' />
                        <span className='hidden md:inline'>Edit</span>
                    </button>
                    <button onClick={submitHandler} className='flex items-center gap-2 px-2 py-1 rounded bg-red-600 hover:bg-red-500 text-sm whitespace-nowrap'>
                        <CiLogout className='text-base' />
                        <span className='hidden md:inline'>Logout</span>
                    </button>
                </div>
            </div>

            {/* Simple modal for editing profile */}
            {editing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/60" onClick={() => setEditing(false)} />
                    <div className="relative bg-slate-800 p-6 rounded-lg w-full max-w-sm text-white">
                        <h3 className='text-lg font-semibold mb-3'>Edit Profile</h3>
                        <div className='flex flex-col gap-2'>
                            <input value={form.name} onChange={(e) => onChange('name', e.target.value)} className='p-2 rounded bg-slate-700 text-white' placeholder='Name' />
                            <input value={form.email} onChange={(e) => onChange('email', e.target.value)} className='p-2 rounded bg-slate-700 text-white' placeholder='Email' />
                            <input value={form.password} onChange={(e) => onChange('password', e.target.value)} className='p-2 rounded bg-slate-700 text-white' placeholder='New password (leave blank to keep)' />
                        </div>
                        <div className='flex justify-end gap-2 mt-4'>
                            <button type='button' onClick={() => setEditing(false)} className='px-3 py-1 rounded bg-gray-600 hover:bg-gray-500'>Cancel</button>
                            <button type='button' onClick={submitProfile} className='px-3 py-1 rounded bg-blue-600 hover:bg-blue-500'>Save</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Logout
