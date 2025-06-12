import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const navStyle = {
    padding: '16px 24px',
    background: '#1976d2',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  const linkStyle = {
    color: '#fff',
    textDecoration: 'none',
    padding: '8px 12px',
    borderRadius: '4px',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: 'rgba(255,255,255,0.1)'
    }
  };

  const brandStyle = {
    ...linkStyle,
    fontWeight: 'bold',
    fontSize: '1.2em',
    marginRight: 'auto'
  };

  const buttonStyle = {
    background: 'transparent',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    padding: '8px 12px',
    borderRadius: '4px',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: 'rgba(255,255,255,0.1)'
    }
  };

  return (
    <nav style={navStyle}>
      <Link to="/" style={brandStyle}>Dress Shop</Link>
      
      <div style={{ display: 'flex', gap: '16px', marginRight: 'auto' }}>
        <Link to="/?category=men" style={linkStyle}>Men's Collection</Link>
        <Link to="/?category=women" style={linkStyle}>Women's Collection</Link>
        <Link to="/deals" style={linkStyle}>Special Deals</Link>
      </div>

      <div style={{ display: 'flex', gap: '16px' }}>
        <Link to="/cart" style={linkStyle}>Cart</Link>
        {token ? (
          <>
            <Link to="/my-account" style={linkStyle}>My Account</Link>
            <button onClick={handleLogout} style={buttonStyle}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={linkStyle}>Login</Link>
            <Link to="/register" style={linkStyle}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 