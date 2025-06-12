import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem('cart') || '[]'));
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    const updatedCart = cart.map(item =>
      item._id === itemId ? { ...item, quantity: newQuantity } : item
    );
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleRemoveItem = (itemId) => {
    const updatedCart = cart.filter(item => item._id !== itemId);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    navigate('/checkout', {
      state: {
        cartItems: cart,
        totalAmount: total
      }
    });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Your Cart</h2>
      {cart.length === 0 ? (
        <div style={styles.emptyCart}>
          <p>Your cart is empty</p>
          <p>Add some items to your cart to continue shopping</p>
        </div>
      ) : (
        <>
          <div style={styles.cartItems}>
            {cart.map(item => (
              <div key={item._id} style={styles.cartItem}>
                <img 
                  src={item.images[0]} 
                  alt={item.name} 
                  style={styles.itemImage}
                />
                <div style={styles.itemDetails}>
                  <h3 style={styles.itemName}>{item.name}</h3>
                  <p style={styles.itemPrice}>${item.price.toFixed(2)}</p>
                  <div style={styles.quantityControls}>
                    <button 
                      onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      style={styles.quantityButton}
                    >
                      -
                    </button>
                    <span style={styles.quantity}>{item.quantity}</span>
                    <button 
                      onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                      style={styles.quantityButton}
                    >
                      +
                    </button>
                  </div>
                </div>
                <button 
                  onClick={() => handleRemoveItem(item._id)}
                  style={styles.removeButton}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div style={styles.summary}>
            <div style={styles.totalRow}>
              <span>Total:</span>
              <span style={styles.totalAmount}>${total.toFixed(2)}</span>
            </div>
            <button 
              onClick={handleCheckout}
              style={styles.checkoutButton}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
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
  emptyCart: {
    textAlign: 'center',
    padding: '40px',
    color: '#666'
  },
  cartItems: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  cartItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  itemImage: {
    width: '100px',
    height: '100px',
    objectFit: 'cover',
    borderRadius: '4px'
  },
  itemDetails: {
    flex: 1,
    marginLeft: '20px'
  },
  itemName: {
    fontSize: '18px',
    marginBottom: '8px',
    color: '#333'
  },
  itemPrice: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '8px'
  },
  quantityControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  quantityButton: {
    padding: '5px 10px',
    border: '1px solid #ddd',
    backgroundColor: 'white',
    cursor: 'pointer',
    borderRadius: '4px'
  },
  quantity: {
    fontSize: '16px',
    minWidth: '30px',
    textAlign: 'center'
  },
  removeButton: {
    padding: '8px 16px',
    backgroundColor: '#ff4444',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginLeft: '20px'
  },
  summary: {
    marginTop: '20px',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    fontSize: '18px'
  },
  totalAmount: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333'
  },
  checkoutButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px'
  }
};

export default Cart; 