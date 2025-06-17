import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';
import { FILE_BASE_URL } from '../config/api';

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
                profileImage = `${FILE_BASE_URL}${profileImage}`;
            } else {
                profileImage = `${FILE_BASE_URL}/uploads/profile-images/${profileImage}`;
            }
        } else {
            // Set default profile image from server
            profileImage = `${FILE_BASE_URL}/uploads/profile-images/default-avatar.png`;
        }
        
        // Ensure all user data fields are included
        return {
            ...userData,
            profileImage,
            mobileNumber: userData.mobileNumber || ''
        };
    };

    const fetchUserData = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setUser(null);
                setIsLoading(false);
                return;
            }

            const response = await authAPI.getCurrentUser();
            if (response.data) {
                const formattedUser = formatUserData(response.data);
                setUser(formattedUser);
            }
        } catch (err) {
            console.error('Error fetching user data:', err);
            if (err.response?.status === 401) {
                localStorage.removeItem('token');
                setUser(null);
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    const register = async (formData) => {
        try {
            const response = await authAPI.register(formData);
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                if (response.data.user) {
                    const formattedUser = formatUserData(response.data.user);
                    setUser(formattedUser);
                }
            }
            return response.data;
        } catch (err) {
            console.error('Registration error:', err);
            throw err;
        }
    };

    const login = async (credentials) => {
        try {
            const response = await authAPI.login(credentials);
            if (response.data.success) {
                const { token, user } = response.data;
                localStorage.setItem('token', token);
                setUser(formatUserData(user));
                setIsLoading(false);
                return { success: true };
            }
            return { success: false, message: response.data.message || 'Login failed' };
        } catch (error) {
            console.error('Login error:', error);
            setIsLoading(false);
            return { 
                success: false, 
                message: error.response?.data?.message || 'Login failed. Please try again.' 
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const updateProfile = async (profileData) => {
        try {
            const response = await authAPI.updateProfile(profileData);
            const updatedUser = formatUserData(response.data);
            setUser(updatedUser);
            return updatedUser;
        } catch (err) {
            console.error('Profile update error:', err);
            if (err.response?.status === 401) {
                localStorage.removeItem('token');
                setUser(null);
                throw new Error('Your session has expired. Please log in again.');
            }
            throw err.response?.data || { message: 'Profile update failed' };
        }
    };

    // Fetch user data only once on mount
    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    const value = {
        user,
        isLoading,
        error,
        register,
        login,
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