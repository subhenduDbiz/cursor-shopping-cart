import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Account = () => {
    const navigate = useNavigate();
    const { user, fetchUserData } = useAuth();

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>My Account</h2>
            <div style={styles.profileSection}>
                <div style={styles.profileImageContainer}>
                    <img 
                        src={user.profileImage || 'https://via.placeholder.com/150'} 
                        alt="Profile" 
                        style={styles.profileImage}
                    />
                </div>
                <div style={styles.userInfo}>
                    <p style={styles.name}>{user.name}</p>
                    <p style={styles.email}>{user.email}</p>
                    {user.mobileNumber && (
                        <p style={styles.mobile}>{user.mobileNumber}</p>
                    )}
                </div>
            </div>
            <div style={styles.actions}>
                <button 
                    onClick={() => navigate('/my-account')}
                    style={styles.button}
                >
                    Edit Profile
                </button>
                <button 
                    onClick={() => navigate('/my-account?tab=orders')}
                    style={styles.button}
                >
                    View Orders
                </button>
            </div>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px'
    },
    title: {
        fontSize: '24px',
        marginBottom: '20px',
        color: '#333'
    },
    profileSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        marginBottom: '30px',
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    profileImageContainer: {
        width: '150px',
        height: '150px',
        borderRadius: '50%',
        overflow: 'hidden'
    },
    profileImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover'
    },
    userInfo: {
        flex: 1
    },
    name: {
        fontSize: '20px',
        fontWeight: 'bold',
        marginBottom: '8px',
        color: '#333'
    },
    email: {
        fontSize: '16px',
        color: '#666',
        marginBottom: '4px'
    },
    mobile: {
        fontSize: '16px',
        color: '#666'
    },
    actions: {
        display: 'flex',
        gap: '10px'
    },
    button: {
        padding: '10px 20px',
        backgroundColor: '#1976d2',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        transition: 'background-color 0.2s',
        ':hover': {
            backgroundColor: '#1565c0'
        }
    }
};

export default Account; 