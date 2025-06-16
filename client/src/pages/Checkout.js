import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const Checkout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { cartItems, totalAmount } = location.state || { cartItems: [], totalAmount: 0 };

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

    // Redirect if no cart items
    React.useEffect(() => {
        if (!cartItems || cartItems.length === 0) {
            navigate('/cart');
        }
    }, [cartItems, navigate]);

    const handleInputChange = (e) => {
        setShippingAddress({
            ...shippingAddress,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Please log in to complete your order');
                setLoading(false);
                navigate('/login');
                return;
            }

            const orderItems = cartItems.map(item => ({
                product: item._id,
                quantity: item.quantity,
                price: item.price
            }));

            // Format shipping address to match the model
            const formattedShippingAddress = {
                street: shippingAddress.streetAddress,
                city: shippingAddress.city,
                state: shippingAddress.state,
                zipCode: shippingAddress.zipCode,
                country: shippingAddress.country
            };

            const orderData = {
                items: orderItems,
                totalAmount: Number(totalAmount),
                shippingAddress: formattedShippingAddress,
                paymentMethod: 'Cash on Delivery',
                status: 'Pending'
            };

            console.log('Sending order data:', orderData);

            const response = await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/api/orders`,
                orderData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            // Clear cart after successful order
            localStorage.removeItem('cart');
            navigate('/my-account?tab=orders');
        } catch (err) {
            console.error('Order error:', err.response?.data);
            if (err.response?.status === 401) {
                setError('Your session has expired. Please log in again.');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                setError(err.response?.data?.message || 'Error placing order');
                if (err.response?.data?.errors) {
                    setError(err.response.data.errors.map(e => e.msg).join(', '));
                }
            }
        } finally {
            setLoading(false);
        }
    };

    if (!cartItems || cartItems.length === 0) {
        return null;
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Checkout</h1>
            
            {error && <div style={styles.error}>{error}</div>}

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
                    <div style={styles.summaryContent}>
                        <div style={styles.cartItems}>
                            {cartItems.map(item => (
                                <div key={item._id} style={styles.cartItem}>
                                    <img 
                                        src={item.images[0]} 
                                        alt={item.name} 
                                        style={styles.itemImage}
                                    />
                                    <div style={styles.itemDetails}>
                                        <h3 style={styles.itemName}>{item.name}</h3>
                                        <p style={styles.itemPrice}>
                                            ${item.price.toFixed(2)} x {item.quantity}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div style={styles.summaryRow}>
                            <span>Total Items:</span>
                            <span>{cartItems.reduce((total, item) => total + item.quantity, 0)}</span>
                        </div>
                        <div style={styles.summaryRow}>
                            <span>Total Amount:</span>
                            <span>${totalAmount.toFixed(2)}</span>
                        </div>
                        <div style={styles.summaryRow}>
                            <span>Payment Method:</span>
                            <span>Cash on Delivery</span>
                        </div>
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
    content: {
        display: 'flex',
        gap: '40px'
    },
    formSection: {
        flex: 2
    },
    orderSummary: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px',
        height: 'fit-content'
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
        display: 'flex',
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
        padding: '12px 24px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        marginTop: '20px',
        ':disabled': {
            backgroundColor: '#cccccc',
            cursor: 'not-allowed'
        }
    },
    error: {
        padding: '10px',
        backgroundColor: '#f8d7da',
        color: '#721c24',
        borderRadius: '4px',
        marginBottom: '20px'
    },
    summaryContent: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
    },
    cartItems: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        marginBottom: '20px'
    },
    cartItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px',
        backgroundColor: 'white',
        borderRadius: '4px'
    },
    itemImage: {
        width: '50px',
        height: '50px',
        objectFit: 'cover',
        borderRadius: '4px'
    },
    itemDetails: {
        flex: 1
    },
    itemName: {
        fontSize: '14px',
        margin: 0,
        color: '#333'
    },
    itemPrice: {
        fontSize: '14px',
        margin: '4px 0 0',
        color: '#666'
    },
    summaryRow: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '10px 0',
        borderBottom: '1px solid #ddd'
    }
};

export default Checkout; 