import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Message from './components/Message';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MyAccount from './pages/MyAccount';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Deals from './pages/Deals';
import ProductDetails from './pages/ProductDetails';
import { useCart } from './context/CartContext';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <AppWithMessage />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

// Separate component to use the useCart hook
function AppWithMessage() {
  const { message, messageType, clearMessage } = useCart();

  return (
    <>
      <Navbar />
      {message && (
        <Message 
          message={message} 
          type={messageType} 
          onClose={() => clearMessage()} 
        />
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/my-account" element={<MyAccount />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/deals" element={<Deals />} />
        <Route path="/product/:id" element={<ProductDetails />} />
      </Routes>
    </>
  );
}

export default App;
