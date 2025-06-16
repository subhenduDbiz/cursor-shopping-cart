import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import OrderHistory from '../components/OrderHistory';

const MyAccount = () => {
    const { user, updateProfile, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('profile');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobileNumber: '',
        profileImage: null
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

    // Update form data when user data changes
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                mobileNumber: user.mobileNumber || '',
                profileImage: null
            });
            setPreviewImage(user.profileImage || null);
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                profileImage: file
            }));
            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            setIsLoading(true);
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('mobileNumber', formData.mobileNumber);
            if (formData.profileImage) {
                formDataToSend.append('profileImage', formData.profileImage);
            }

            await updateProfile(formDataToSend);
            setMessage('Profile updated successfully');
            
            // Reset form data but keep the updated values
            setFormData(prev => ({
                ...prev,
                profileImage: null
            }));
        } catch (err) {
            console.error('Profile update error:', err);
            if (err.message.includes('session has expired')) {
                setError(err.message);
                setTimeout(() => {
                    logout();
                    navigate('/login');
                }, 2000);
            } else {
                setError(err.message || 'Failed to update profile');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        // Validate passwords
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setError('New password must be at least 6 characters long');
            return;
        }

        try {
            setIsLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `${process.env.REACT_APP_API_BASE_URL}/api/auth/change-password`,
                {
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            setMessage('Password updated successfully');
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (err) {
            console.error('Password change error:', err);
            setError(err.response?.data?.message || 'Failed to change password');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getProfileImageUrl = (imagePath) => {
        if (!imagePath) return `${process.env.REACT_APP_API_BASE_URL}/uploads/profile-images/default-avatar.png`;
        if (imagePath.startsWith('http')) return imagePath;
        return `${process.env.REACT_APP_API_BASE_URL}${imagePath}`;
    };

    if (!user) {
        return <div style={styles.loading}>Loading...</div>;
    }

    return (
        <div style={styles.container}>
            <div style={styles.sidebar}>
                <h2 style={styles.sidebarTitle}>My Account</h2>
                <div style={styles.profileImageContainer}>
                    <img 
                        src={getProfileImageUrl(user.profileImage)} 
                        alt="Profile" 
                        style={styles.profileImage}
                    />
                </div>
                <button
                    style={{
                        ...styles.sidebarButton,
                        ...(activeTab === 'profile' && styles.activeButton)
                    }}
                    onClick={() => setActiveTab('profile')}
                >
                    Profile
                </button>
                <button
                    style={{
                        ...styles.sidebarButton,
                        ...(activeTab === 'orders' && styles.activeButton)
                    }}
                    onClick={() => setActiveTab('orders')}
                >
                    Order History
                </button>
                <button
                    style={styles.logoutButton}
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>

            <div style={styles.content}>
                {message && <div style={styles.successMessage}>{message}</div>}
                {error && <div style={styles.errorMessage}>{error}</div>}

                {activeTab === 'profile' && (
                    <div>
                        <h2 style={styles.title}>Profile Information</h2>
                        <form onSubmit={handleProfileUpdate} style={styles.form}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Profile Image</label>
                                <div style={styles.imageContainer}>
                                    <img 
                                        src={previewImage || getProfileImageUrl(user.profileImage)} 
                                        alt="Profile" 
                                        style={styles.profileImage}
                                    />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        style={styles.fileInput}
                                    />
                                </div>
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    style={styles.input}
                                    required
                                />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    style={styles.input}
                                    required
                                />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Mobile Number</label>
                                <input
                                    type="tel"
                                    name="mobileNumber"
                                    value={formData.mobileNumber}
                                    onChange={handleInputChange}
                                    style={styles.input}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                style={styles.submitButton}
                            >
                                {isLoading ? 'Updating...' : 'Update Profile'}
                            </button>
                        </form>
                    </div>
                )}

                {activeTab === 'orders' && <OrderHistory />}
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        minHeight: 'calc(100vh - 64px)',
        backgroundColor: '#f5f5f5'
    },
    sidebar: {
        width: '250px',
        backgroundColor: 'white',
        padding: '20px',
        boxShadow: '2px 0 5px rgba(0,0,0,0.1)'
    },
    sidebarTitle: {
        marginBottom: '20px',
        color: '#333'
    },
    profileImageContainer: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '20px'
    },
    profileImage: {
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        objectFit: 'cover',
        border: '3px solid #1976d2'
    },
    sidebarButton: {
        display: 'block',
        width: '100%',
        padding: '10px',
        marginBottom: '10px',
        border: 'none',
        backgroundColor: 'transparent',
        textAlign: 'left',
        cursor: 'pointer',
        fontSize: '16px',
        color: '#666'
    },
    activeButton: {
        backgroundColor: '#f0f0f0',
        color: '#333',
        fontWeight: 'bold'
    },
    logoutButton: {
        display: 'block',
        width: '100%',
        padding: '10px',
        marginTop: '20px',
        border: 'none',
        backgroundColor: '#ff4444',
        color: 'white',
        cursor: 'pointer',
        fontSize: '16px'
    },
    content: {
        flex: 1,
        padding: '20px'
    },
    title: {
        marginBottom: '20px',
        color: '#333'
    },
    form: {
        maxWidth: '500px',
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    formGroup: {
        marginBottom: '20px'
    },
    label: {
        display: 'block',
        marginBottom: '5px',
        color: '#666'
    },
    input: {
        width: '100%',
        padding: '8px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '16px'
    },
    submitButton: {
        backgroundColor: '#1976d2',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px'
    },
    successMessage: {
        backgroundColor: '#4caf50',
        color: 'white',
        padding: '10px',
        borderRadius: '4px',
        marginBottom: '20px'
    },
    errorMessage: {
        backgroundColor: '#f44336',
        color: 'white',
        padding: '10px',
        borderRadius: '4px',
        marginBottom: '20px'
    },
    loading: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 64px)',
        fontSize: '18px',
        color: '#666'
    },
    imageContainer: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '20px'
    },
    fileInput: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: 0,
        cursor: 'pointer'
    }
};

export default MyAccount; 