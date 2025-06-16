import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Checkout = () => {
    const navigate = useNavigate();
    const { cartItems, getCartTotal, clearCart } = useCart();
    const { user } = useAuth();

    const [shippingAddress, setShippingAddress] = useState({
        fullName: '',
        streetAddress: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        phone: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    // Redirect if no cart items or not logged in
    React.useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        if (!cartItems || cartItems.length === 0) {
            navigate('/cart');
        }
    }, [cartItems, user, navigate]);

    const handleInputChange = (e) => {
        setShippingAddress({
            ...shippingAddress,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (!user) {
                navigate('/login', { state: { from: '/checkout' } });
                return;
            }

            // Format shipping address
            const formattedAddress = {
                street: shippingAddress.streetAddress,
                city: shippingAddress.city,
                state: shippingAddress.state,
                zipCode: shippingAddress.zipCode,
                country: shippingAddress.country
            };

            // Format order data
            const orderData = {
                items: cartItems.map(item => ({
                    product: item.product._id,
                    quantity: item.quantity,
                    price: item.product.price
                })),
                shippingAddress: formattedAddress,
                totalAmount: getCartTotal(),
                paymentMethod: 'Cash on Delivery'
            };

            const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/orders`, orderData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            // Clear cart after successful order
            clearCart();

            // Show success message
            setMessage('Order placed successfully!');

            // Redirect to order history after a short delay
            setTimeout(() => {
                navigate('/my-account?tab=orders');
            }, 1500);

        } catch (err) {
            if (err.response?.status === 401) {
                navigate('/login', { state: { from: '/checkout' } });
            } else {
                setError(err.response?.data?.message || 'Failed to place order. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (!user || !cartItems || cartItems.length === 0) {
        return null;
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Checkout</h1>
            
            {error && <div style={styles.error}>{error}</div>}
            {message && <div style={styles.message}>{message}</div>}

            <div style={styles.content}>
                <div style={styles.formSection}>
                    <h2 style={styles.sectionTitle}>Shipping Information</h2>
                    <form onSubmit={handleSubmit} style={styles.form}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                value={shippingAddress.fullName}
                                onChange={handleInputChange}
                                style={styles.input}
                                required
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Street Address</label>
                            <input
                                type="text"
                                name="streetAddress"
                                value={shippingAddress.streetAddress}
                                onChange={handleInputChange}
                                style={styles.input}
                                required
                            />
                        </div>

                        <div style={styles.formRow}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>City</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={shippingAddress.city}
                                    onChange={handleInputChange}
                                    style={styles.input}
                                    required
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>State</label>
                                <input
                                    type="text"
                                    name="state"
                                    value={shippingAddress.state}
                                    onChange={handleInputChange}
                                    style={styles.input}
                                    required
                                />
                            </div>
                        </div>

                        <div style={styles.formRow}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>ZIP Code</label>
                                <input
                                    type="text"
                                    name="zipCode"
                                    value={shippingAddress.zipCode}
                                    onChange={handleInputChange}
                                    style={styles.input}
                                    required
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Country</label>
                                <input
                                    type="text"
                                    name="country"
                                    value={shippingAddress.country}
                                    onChange={handleInputChange}
                                    style={styles.input}
                                    required
                                />
                            </div>
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                value={shippingAddress.phone}
                                onChange={handleInputChange}
                                style={styles.input}
                                required
                            />
                        </div>

                        <button 
                            type="submit" 
                            style={styles.submitButton}
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : 'Place Order'}
                        </button>
                    </form>
                </div>

                <div style={styles.orderSummary}>
                    <h2 style={styles.sectionTitle}>Order Summary</h2>
                    <div style={styles.itemsList}>
                        {cartItems.map(item => (
                            <div key={item.product._id} style={styles.orderItem}>
                                <div style={styles.itemInfo}>
                                    <span style={styles.itemName}>{item.product.name}</span>
                                    <span style={styles.itemQuantity}>x{item.quantity}</span>
                                </div>
                                <span style={styles.itemPrice}>
                                    ${(item.product.price * item.quantity).toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div style={styles.total}>
                        <span>Total:</span>
                        <span style={styles.totalAmount}>${getCartTotal().toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px'
    },
    title: {
        fontSize: '24px',
        marginBottom: '20px',
        color: '#333'
    },
    error: {
        backgroundColor: '#ffebee',
        color: '#c62828',
        padding: '10px',
        borderRadius: '4px',
        marginBottom: '20px'
    },
    message: {
        backgroundColor: '#e8f5e9',
        color: '#43a047',
        padding: '10px',
        borderRadius: '4px',
        marginBottom: '20px'
    },
    content: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '40px'
    },
    formSection: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    sectionTitle: {
        fontSize: '20px',
        marginBottom: '20px',
        color: '#333'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    },
    formRow: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px'
    },
    label: {
        fontSize: '14px',
        color: '#666'
    },
    input: {
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '16px'
    },
    submitButton: {
        padding: '12px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        marginTop: '20px',
        ':disabled': {
            backgroundColor: '#ccc',
            cursor: 'not-allowed'
        }
    },
    orderSummary: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    itemsList: {
        marginBottom: '20px'
    },
    orderItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 0',
        borderBottom: '1px solid #eee'
    },
    itemInfo: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
    },
    itemName: {
        fontSize: '16px',
        color: '#333'
    },
    itemQuantity: {
        fontSize: '14px',
        color: '#666'
    },
    itemPrice: {
        fontSize: '16px',
        color: '#333',
        fontWeight: '500'
    },
    total: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 0',
        borderTop: '2px solid #eee',
        fontSize: '18px',
        fontWeight: '500'
    },
    totalAmount: {
        fontSize: '24px',
        color: '#333'
    }
};

export default Checkout; 