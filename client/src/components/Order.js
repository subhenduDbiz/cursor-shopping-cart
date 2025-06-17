import React, { useState, useEffect } from 'react';
import { orderAPI } from '../services/api';

const Order = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await orderAPI.getAll();
            setOrders(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch orders');
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'orange';
            case 'processing':
                return 'blue';
            case 'shipped':
                return 'purple';
            case 'delivered':
                return 'green';
            case 'cancelled':
                return 'red';
            default:
                return 'gray';
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="orders-container">
            <h2>My Orders</h2>
            {orders.length === 0 ? (
                <p>No orders found</p>
            ) : (
                <div className="orders-list">
                    {orders.map((order) => (
                        <div key={order._id} className="order-card">
                            <div className="order-header">
                                <h3>Order #{order._id}</h3>
                                <span
                                    className="order-status"
                                    style={{ backgroundColor: getStatusColor(order.status) }}
                                >
                                    {order.status}
                                </span>
                            </div>
                            <div className="order-details">
                                <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                                <p>Total: ${order.total}</p>
                                <p>Payment Method: {order.paymentMethod}</p>
                            </div>
                            <div className="order-items">
                                <h4>Items:</h4>
                                {order.items.map((item) => (
                                    <div key={item._id} className="order-item">
                                        <img src={item.product.image} alt={item.product.name} />
                                        <div className="item-details">
                                            <h5>{item.product.name}</h5>
                                            <p>Quantity: {item.quantity}</p>
                                            <p>Price: ${item.product.price}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="shipping-address">
                                <h4>Shipping Address:</h4>
                                <p>{order.shippingAddress.street}</p>
                                <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                                <p>{order.shippingAddress.zipCode}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Order; 