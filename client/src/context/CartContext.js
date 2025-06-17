import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../services/api';
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
        const fetchCartItems = async () => {
            if (user) {
                try {
                    setLoading(true);
                    const response = await cartAPI.get();
                    if (response.data) {
                        setCartItems(response.data.items || []);
                    }
                } catch (error) {
                    console.error('Error fetching cart:', error);
                    setCartItems([]);
                } finally {
                    setLoading(false);
                }
            } else {
                setCartItems([]);
            }
        };

        fetchCartItems();
    }, [user]); // Only depend on user changes

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

    const addToCart = async (product, quantity = 1) => {
        if (!user) {
            showMessage('Please login to add items to cart', 'warning');
            return;
        }

        try {
            setLoading(true);
            const response = await cartAPI.addItem({ 
                productId: product._id,
                quantity: quantity
            });
            setCartItems(response.data.items);
            showMessage('Item added to cart', 'success');
        } catch (err) {
            console.error('Error adding to cart:', err);
            const errorMessage = err.response?.data?.msg || err.response?.data?.message || 'Error adding item to cart';
            showMessage(errorMessage, 'error');
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
            const response = await cartAPI.removeItem(productId);
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
        if (!user || quantity < 0) return;

        try {
            setLoading(true);
            const response = await cartAPI.updateItem(productId, { quantity });
            setCartItems(response.data.items);
            showMessage('Cart updated', 'success');
        } catch (err) {
            console.error('Error updating cart:', err);
            const errorMessage = err.response?.data?.msg || err.response?.data?.message || 'Error updating cart';
            showMessage(errorMessage, 'error');
        } finally {
            setLoading(false);
        }

        // Clear message after 3 seconds
        setTimeout(() => {
            setMessage('');
        }, 3000);
    };

    const clearCart = async () => {
        if (!user) return;

        try {
            setLoading(true);
            await cartAPI.clear();
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