import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expandedOrder, setExpandedOrder] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/orders`, {
                    headers: {
                        'x-auth-token': token
                    }
                });
                console.log('Fetched orders:', response.data);
                setOrders(response.data);
            } catch (err) {
                setError('Error fetching orders');
                console.error('Error fetching orders:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const toggleOrderDetails = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    const renderProductImage = (item) => {
        console.log('Rendering product:', item);
        
        if (!item.product) {
            console.log('No product data available');
            return <div style={styles.placeholderImage}>No Image</div>;
        }
        
        const imageUrl = item.product.images && item.product.images[0];
        if (!imageUrl) {
            console.log('No image URL available');
            return <div style={styles.placeholderImage}>No Image</div>;
        }

        console.log('Using image URL:', imageUrl);
        return (
            <img
                src={imageUrl}
                alt={item.product.name || 'Product image'}
                style={styles.itemImage}
                onError={(e) => {
                    console.log('Image failed to load:', imageUrl);
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                    e.target.parentNode.innerHTML = '<div style="' + 
                        Object.entries(styles.placeholderImage)
                            .map(([key, value]) => `${key}:${value}`)
                            .join(';') + 
                        '">No Image</div>';
                }}
            />
        );
    };

    if (loading) return <div>Loading orders...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Order History</h2>
            {orders.length === 0 ? (
                <p>No orders found</p>
            ) : (
                orders.map(order => (
                    <div key={order._id} style={styles.orderCard}>
                        <div 
                            style={styles.orderHeader}
                            onClick={() => toggleOrderDetails(order._id)}
                            className="clickable"
                        >
                            <div style={styles.orderSummary}>
                                <div>
                                    <strong>Order ID:</strong> {order._id}
                                </div>
                                <div>
                                    <strong>Date:</strong> {new Date(order.orderDate).toLocaleDateString()}
                                </div>
                                <div>
                                    <strong>Total:</strong> ${order.totalAmount}
                                </div>
                                <div>
                                    <strong>Status:</strong> {order.status}
                                </div>
                            </div>
                            <div style={styles.expandIcon}>
                                {expandedOrder === order._id ? '▼' : '▶'}
                            </div>
                        </div>
                        
                        {expandedOrder === order._id && (
                            <div style={styles.orderDetails}>
                                <div style={styles.itemsList}>
                                    {order.items && order.items.map((item, index) => (
                                        <div key={index} style={styles.item}>
                                            {renderProductImage(item)}
                                            <div style={styles.itemDetails}>
                                                <h4>{item.product?.name || 'Product Name Not Available'}</h4>
                                                <p>Quantity: {item.quantity}</p>
                                                <p>Price: ${item.price}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div style={styles.orderFooter}>
                                    <div>
                                        <strong>Payment Method:</strong> {order.paymentMethod}
                                    </div>
                                </div>
                                {order.shippingAddress && (
                                    <div style={styles.address}>
                                        <strong>Shipping Address:</strong>
                                        <p>
                                            {order.shippingAddress.street}<br />
                                            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                                            {order.shippingAddress.country}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto'
    },
    title: {
        textAlign: 'center',
        marginBottom: '20px'
    },
    orderCard: {
        border: '1px solid #ddd',
        borderRadius: '8px',
        marginBottom: '10px',
        backgroundColor: 'white',
        overflow: 'hidden'
    },
    orderHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px 20px',
        backgroundColor: '#f8f9fa',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        ':hover': {
            backgroundColor: '#e9ecef'
        }
    },
    orderSummary: {
        display: 'flex',
        gap: '20px',
        flex: 1
    },
    expandIcon: {
        fontSize: '12px',
        color: '#666'
    },
    orderDetails: {
        padding: '20px',
        borderTop: '1px solid #eee'
    },
    itemsList: {
        marginBottom: '15px'
    },
    item: {
        display: 'flex',
        alignItems: 'center',
        padding: '10px 0',
        borderBottom: '1px solid #eee'
    },
    itemImage: {
        width: '80px',
        height: '80px',
        objectFit: 'cover',
        marginRight: '15px',
        borderRadius: '4px'
    },
    placeholderImage: {
        width: '80px',
        height: '80px',
        backgroundColor: '#f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: '15px',
        borderRadius: '4px',
        color: '#666'
    },
    itemDetails: {
        flex: 1
    },
    orderFooter: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '15px',
        paddingTop: '10px',
        borderTop: '1px solid #eee'
    },
    address: {
        marginTop: '15px',
        padding: '10px',
        backgroundColor: '#f8f9fa',
        borderRadius: '4px'
    }
};

export default OrderHistory; 