import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
// import { useAuth } from './AuthProvider';
export function useGetAllUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    // const [authUser, setAuthUser] = useAuth();
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                // const token = Cookies.get('token');
                // console.log("Token sources:", {
                //     cookieToken: Cookies.get('token'),
                //   });
                // if (!authUser) {
                //     setIsAuthenticated(false);
                //     setLoading(false);  
                //     return;
                // }

                const response = await axios.get('http://localhost:4000/api/chat/users', {
                    withCredentials: true // Cookies only
                  });

                setUsers(response.data);
                setIsAuthenticated(true);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch users');
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    return [
        users,
        setUsers,
        loading,
        error,
        isAuthenticated      
    ];
}