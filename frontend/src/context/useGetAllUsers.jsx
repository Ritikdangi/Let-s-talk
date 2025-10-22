import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useAuth } from './useAuth.jsx';

export function useGetAllUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [authUser , setAuthUser,] = useAuth();
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchUsers = async () => {
            // if (!authUser?.user?._id) {
            //     setLoading(false);
            //     return;
            // }

            try {
                setLoading(true);
                const url = `${API_URL}/api/chat/users`;
                console.log('Fetching users from:', url);
                                // If cookie is missing, send JWT in Authorization header
                                let headers = {};
                                if (!Cookies.get('token') && authUser?.jwt) {
                                    headers['Authorization'] = `Bearer ${authUser.jwt}`;
                                }
                                const response = await axios.get(url, {
                                        withCredentials: true,
                                        headers
                                });
                console.log('Users response status:', response.status);

                // Normalize response: the backend may return an array or an object with a `users` field.
                let list = [];
                if (Array.isArray(response.data)) {
                    list = response.data;
                } else if (Array.isArray(response.data?.users)) {
                    list = response.data.users;
                } else if (Array.isArray(response.data?.data)) {
                    list = response.data.data;
                } else {
                    // Fallback: if response.data is an object but not an array, log and coerce to empty
                    console.warn('Unexpected users response shape:', response.data);
                    list = [];
                }

                setUsers(list);
                // For each user, attempt to fetch the last message in the conversation with the authenticated user
                try {
                    const fetchLasts = await Promise.all(list.map(async (u) => {
                        try {
                            const meResp = await axios.get(`${API_URL}/api/message/get/${u._id}`, { withCredentials: true, headers });
                            const msgs = Array.isArray(meResp.data) ? meResp.data : (meResp.data?.messages || []);
                            const last = msgs && msgs.length ? msgs[msgs.length - 1].message : null;
                            return { ...u, lastMessage: last };
                        } catch (e) {
                            return { ...u, lastMessage: null };
                        }
                    }));
                    setUsers(fetchLasts);
                } catch (e) {
                    // if fetching last messages fails, keep the plain list
                    console.debug('Failed to fetch last messages for users', e);
                }
                setError(null);
            } catch (err) {
                console.error('Error fetching users:', err);
                setError(err.response?.data?.message || 'Failed to fetch users');
                setUsers([]);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [authUser?.user?._id]);

    return [users, setUsers, loading, error];
}