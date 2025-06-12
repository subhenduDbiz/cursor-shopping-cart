import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import OrderHistory from '../components/OrderHistory';

const MyAccount = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('profile');
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/users/profile`, {
                name: formData.name,
                email: formData.email
            }, {
                headers: {
                    'x-auth-token': token
                }
            });
            setUser(response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
            setMessage('Profile updated successfully');
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Error updating profile');
            setMessage('');
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            setError('New passwords do not match');
            return;
        }
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/users/password`, {
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword
            }, {
                headers: {
                    'x-auth-token': token
                }
            });
            setMessage('Password updated successfully');
            setError('');
            setFormData({
                ...formData,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Error updating password');
            setMessage('');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div style={styles.container}>
            <div style={styles.sidebar}>
                <h2 style={styles.sidebarTitle}>My Account</h2>
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
                            <button type="submit" style={styles.submitButton}>
                                Update Profile
                            </button>
                        </form>

                        <h2 style={styles.title}>Change Password</h2>
                        <form onSubmit={handlePasswordChange} style={styles.form}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Current Password</label>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    value={formData.currentPassword}
                                    onChange={handleInputChange}
                                    style={styles.input}
                                    required
                                />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>New Password</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleInputChange}
                                    style={styles.input}
                                    required
                                />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Confirm New Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    style={styles.input}
                                    required
                                />
                            </div>
                            <button type="submit" style={styles.submitButton}>
                                Change Password
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
        marginBottom: '40px'
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
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '16px'
    },
    submitButton: {
        padding: '10px 20px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px'
    },
    successMessage: {
        padding: '10px',
        backgroundColor: '#dff0d8',
        color: '#3c763d',
        marginBottom: '20px',
        borderRadius: '4px'
    },
    errorMessage: {
        padding: '10px',
        backgroundColor: '#f2dede',
        color: '#a94442',
        marginBottom: '20px',
        borderRadius: '4px'
    }
};

export default MyAccount; 