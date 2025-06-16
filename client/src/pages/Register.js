import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        mobileNumber: '',
        profileImage: null
    });
    const [previewImage, setPreviewImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('password', formData.password);
            formDataToSend.append('mobileNumber', formData.mobileNumber);
            if (formData.profileImage) {
                formDataToSend.append('profileImage', formData.profileImage);
            }

            await register(formDataToSend);
            navigate('/my-account');
        } catch (err) {
            console.error('Registration error:', err);
            if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
                // Handle validation errors
                const errorMessages = err.response.data.errors.map(error => error.msg).join(', ');
                setError(errorMessages);
            } else if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError('Registration failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const styles = {
        container: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            padding: '20px',
            backgroundColor: '#f5f5f5'
        },
        formContainer: {
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            width: '100%',
            maxWidth: '500px'
        },
        title: {
            textAlign: 'center',
            marginBottom: '20px',
            color: '#333'
        },
        form: {
            display: 'flex',
            flexDirection: 'column',
            gap: '15px'
        },
        formGroup: {
            display: 'flex',
            flexDirection: 'column',
            gap: '5px'
        },
        label: {
            fontSize: '14px',
            color: '#333',
            fontWeight: '500'
        },
        input: {
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px'
        },
        submitButton: {
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '12px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '500',
            marginTop: '10px',
            ':hover': {
                backgroundColor: '#45a049'
            }
        },
        loginLink: {
            textAlign: 'center',
            marginTop: '20px',
            color: '#666'
        },
        link: {
            color: '#4CAF50',
            textDecoration: 'none',
            fontWeight: '500',
            ':hover': {
                textDecoration: 'underline'
            }
        },
        errorContainer: {
            backgroundColor: '#ffebee',
            color: '#c62828',
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '20px',
            fontSize: '14px'
        },
        imageUploadContainer: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px'
        },
        profileImage: {
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            objectFit: 'cover'
        },
        fileInput: {
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px'
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.formContainer}>
                <h2 style={styles.title}>Create an Account</h2>
                
                {error && (
                    <div style={styles.errorContainer}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Profile Image</label>
                        <div style={styles.imageUploadContainer}>
                            <img 
                                src={previewImage || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'} 
                                alt="Profile Preview" 
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
                            placeholder="Enter 10-digit mobile number"
                            required
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            style={styles.input}
                            required
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            style={styles.input}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={styles.submitButton}
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <p style={styles.loginLink}>
                    Already have an account? <Link to="/login" style={styles.link}>Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default Register; 