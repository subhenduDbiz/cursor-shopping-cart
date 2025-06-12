import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PlaceOrder = ({ cartItems, totalAmount, onOrderPlaced }) => {
    const navigate = useNavigate();
    const [shippingAddress, setShippingAddress] = useState({
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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
            const orderItems = cartItems.map(item => ({
                product: item._id,
                quantity: item.quantity,
                price: item.price
            }));

            const orderData = {
                items: orderItems,
                totalAmount,
                shippingAddress,
                paymentMethod: 'Cash on Delivery'
            };

            await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/orders`, orderData, {
                headers: {
                    'x-auth-token': token
                }
            });
            onOrderPlaced();
            navigate('/my-account');
        } catch (err) {
            setError(err.response?.data?.message || 'Error placing order');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Place Order</h2>
            {error && <div style={styles.error}>{error}</div>}
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Street Address</label>
                    <input
                        type="text"
                        name="street"
                        value={shippingAddress.street}
                        onChange={handleInputChange}
                        style={styles.input}
                        required
                    />
                </div>
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

                <div style={styles.orderSummary}>
                    <h3>Order Summary</h3>
                    <p>Total Items: {cartItems.length}</p>
                    <p>Total Amount: ${totalAmount}</p>
                    <p>Payment Method: Cash on Delivery</p>
                </div>

                <button
                    type="submit"
                    style={styles.submitButton}
                    disabled={loading}
                >
                    {loading ? 'Placing Order...' : 'Place Order'}
                </button>
            </form>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '600px',
        margin: '0 auto',
        padding: '20px'
    },
    title: {
        textAlign: 'center',
        marginBottom: '20px'
    },
    form: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    formGroup: {
        marginBottom: '15px'
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
    orderSummary: {
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#f8f9fa',
        borderRadius: '4px'
    },
    submitButton: {
        width: '100%',
        padding: '12px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '16px',
        cursor: 'pointer',
        marginTop: '20px'
    },
    error: {
        color: 'red',
        marginBottom: '15px',
        textAlign: 'center'
    }
};

export default PlaceOrder; 