import { useEffect, useState } from 'react';
import axios from 'axios';
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
                const response = await axios.get(`${API_URL}/api/chat/users`, {
                    withCredentials: true
                });

                setUsers(response.data);
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