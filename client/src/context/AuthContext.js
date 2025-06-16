import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const formatUserData = (userData) => {
        if (!userData) return null;
        
        // Fix profile image URL formatting
        let profileImage = userData.profileImage;
        if (profileImage) {
            // If it's already a full URL, use it as is
            if (profileImage.startsWith('http')) {
                return { ...userData, profileImage };
            }
            
            // If it's a relative path, ensure we don't duplicate the base URL
            if (profileImage.startsWith('/uploads/')) {
                profileImage = `${process.env.REACT_APP_API_BASE_URL}${profileImage}`;
            } else {
                profileImage = `${process.env.REACT_APP_API_BASE_URL}/uploads/profile-images/${profileImage}`;
            }
        }
        
        return { ...userData, profileImage };
    };

    const fetchUserData = async () => {
        const token = localStorage.getItem('token');
        console.log('Fetching user data, token exists:', !!token);
        
        if (!token) {
            console.log('No token found, setting user to null');
            setUser(null);
            setIsLoading(false);
            return;
        }

        try {
            console.log('Making API call to fetch user data');
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('User data fetched successfully:', response.data);
            setUser(formatUserData(response.data));
            setError(null);
        } catch (err) {
            console.error('Error fetching user data:', err);
            if (err.response?.status === 401) {
                console.log('Token invalid, removing from localStorage');
                localStorage.removeItem('token');
                setUser(null);
            }
            setError(err.response?.data?.message || 'Error fetching user data');
        } finally {
            setIsLoading(false);
        }
    };

    // Check token and fetch user data on mount
    useEffect(() => {
        console.log('AuthProvider mounted, checking token');
        const token = localStorage.getItem('token');
        if (token) {
            console.log('Token found on mount, fetching user data');
            fetchUserData();
        } else {
            console.log('No token found on mount');
            setIsLoading(false);
        }
    }, []);

    // Listen for storage changes
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'token') {
                console.log('Token changed in storage, fetching user data');
                fetchUserData();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const register = async (formData) => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/api/auth/register`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            const { token, user } = response.data;
            localStorage.setItem('token', token);
            setUser(user);
            return user;
        } catch (err) {
            console.error('Registration error:', err);
            // Pass through the error response from the API
            throw err;
        }
    };

    const login = async (email, password) => {
        try {
            console.log('Attempting login');
            const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/auth/login`, {
                email,
                password
            });
            
            console.log('Login response:', response.data);
            
            if (!response.data.token) {
                throw new Error('No token received from server');
            }

            // Set token in localStorage
            localStorage.setItem('token', response.data.token);
            console.log('Token stored in localStorage');

            // Always fetch user data after login to ensure we have the complete user object
            console.log('Fetching user data after login');
            await fetchUserData();

            // Dispatch storage event
            window.dispatchEvent(new Event('storage'));
            
            return response.data;
        } catch (err) {
            console.error('Login failed:', err);
            // Clear any existing token on login failure
            localStorage.removeItem('token');
            setUser(null);
            throw err.response?.data || { message: 'Login failed' };
        }
    };

    const logout = () => {
        console.log('Logging out, removing token');
        localStorage.removeItem('token');
        setUser(null);
        // Dispatch storage event to notify other components
        window.dispatchEvent(new Event('storage'));
    };

    const updateProfile = async (profileData) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await axios.put(
                `${process.env.REACT_APP_API_BASE_URL}/api/auth/profile`,
                profileData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            // Update the user state with the new data
            const updatedUser = formatUserData(response.data);
            setUser(updatedUser);

            // Dispatch storage event to notify other components
            window.dispatchEvent(new Event('storage'));

            return updatedUser;
        } catch (err) {
            console.error('Profile update error:', err);
            if (err.response?.status === 401) {
                // Handle token expiration
                localStorage.removeItem('token');
                setUser(null);
                throw new Error('Your session has expired. Please log in again.');
            }
            throw err.response?.data || { message: 'Profile update failed' };
        }
    };

    const value = {
        user,
        isLoading,
        error,
        login,
        register,
        logout,
        updateProfile,
        fetchUserData
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}; 