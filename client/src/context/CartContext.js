import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [cartCount, setCartCount] = useState(0);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('info');
    const [loading, setLoading] = useState(false);

    // Fetch cart items when user changes
    useEffect(() => {
        if (user) {
            fetchCartItems();
        } else {
            // Clear cart when user logs out
            setCartItems([]);
            setCartCount(0);
        }
    }, [user]);

    // Update cartCount whenever cartItems change
    useEffect(() => {
        const count = cartItems.reduce((total, item) => total + item.quantity, 0);
        setCartCount(count);
    }, [cartItems]);

    const showMessage = (msg, type = 'info') => {
        setMessage(msg);
        setMessageType(type);
    };

    const clearMessage = () => {
        setMessage('');
    };

    const fetchCartItems = async () => {
        if (!user) return;

        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${process.env.REACT_APP_API_BASE_URL}/api/cart`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setCartItems(response.data.items);
        } catch (err) {
            console.error('Error fetching cart items:', err);
            showMessage('Error loading cart items', 'error');
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (product) => {
        if (!user) {
            showMessage('Please login to add items to cart', 'warning');
            return;
        }

        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/api/cart/add`,
                { productId: product._id },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setCartItems(response.data.items);
            showMessage('Item added to cart', 'success');
        } catch (err) {
            console.error('Error adding to cart:', err);
            setMessage(err.response?.data?.message || 'Error adding item to cart');
        } finally {
            setLoading(false);
        }

        // Clear message after 3 seconds
        setTimeout(() => {
            setMessage('');
        }, 3000);
    };

    const removeFromCart = async (productId) => {
        if (!user) return;

        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.delete(
                `${process.env.REACT_APP_API_BASE_URL}/api/cart/remove/${productId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setCartItems(response.data.items);
            setMessage('Item removed from cart');
        } catch (err) {
            console.error('Error removing from cart:', err);
            setMessage(err.response?.data?.message || 'Error removing item from cart');
        } finally {
            setLoading(false);
        }

        // Clear message after 3 seconds
        setTimeout(() => {
            setMessage('');
        }, 3000);
    };

    const updateQuantity = async (productId, quantity) => {
        if (!user || quantity < 1) return;

        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `${process.env.REACT_APP_API_BASE_URL}/api/cart/update`,
                { productId, quantity },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setCartItems(response.data.items);
        } catch (err) {
            console.error('Error updating cart:', err);
            setMessage(err.response?.data?.message || 'Error updating cart');
        } finally {
            setLoading(false);
        }
    };

    const clearCart = async () => {
        if (!user) return;

        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            await axios.delete(
                `${process.env.REACT_APP_API_BASE_URL}/api/cart/clear`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setCartItems([]);
            setMessage('Cart cleared');
        } catch (err) {
            console.error('Error clearing cart:', err);
            setMessage(err.response?.data?.message || 'Error clearing cart');
        } finally {
            setLoading(false);
        }

        // Clear message after 3 seconds
        setTimeout(() => {
            setMessage('');
        }, 3000);
    };

    const isInCart = (productId) => {
        return cartItems.some(item => item.product._id === productId);
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    };

    const value = {
        cartItems,
        cartCount,
        message,
        messageType,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isInCart,
        getCartTotal,
        clearMessage,
        showMessage
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export default CartContext; 