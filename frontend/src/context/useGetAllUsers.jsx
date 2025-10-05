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
                const url = `${API_URL}/api/chat/users`;
                console.log('Fetching users from:', url);
                const response = await axios.get(url, {
                    withCredentials: true
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