import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaShoppingCart, FaUser, FaSignInAlt, FaUserPlus } from 'react-icons/fa';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isLoading, logout, fetchUserData } = useAuth();

  // Fetch user data when component mounts
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !user) {
      fetchUserData();
    }
  }, [user, fetchUserData]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getProfileImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `${process.env.REACT_APP_API_BASE_URL}${imagePath}`;
  };

  const navStyle = {
    padding: '16px 24px',
    background: '#1a202c',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  const linkStyle = {
    color: '#fff',
    textDecoration: 'none',
    padding: '8px 12px',
    borderRadius: '4px',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  const buttonStyle = {
    background: 'transparent',
    border: '1px solid #fff',
    color: '#fff',
    cursor: 'pointer',
    padding: '8px 16px',
    borderRadius: '4px',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  const userProfileStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  };

  const profileImageStyle = {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid #fff'
  };

  const renderAuthButtons = () => {
    if (isLoading) {
      return null;
    }

    if (user) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link to="/cart" style={linkStyle}>
            <FaShoppingCart /> Cart
          </Link>
          <div style={userProfileStyle}>
            {user.profileImage && (
              <img 
                src={getProfileImageUrl(user.profileImage)} 
                alt={user.name} 
                style={profileImageStyle}
              />
            )}
            <span>Welcome, {user.name}</span>
          </div>
          <Link to="/my-account" style={linkStyle}>
            <FaUser /> My Account
          </Link>
          <button onClick={handleLogout} style={buttonStyle}>
            Logout
          </button>
        </div>
      );
    }

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Link to="/login" style={buttonStyle}>
          <FaSignInAlt /> Login
        </Link>
        <Link to="/register" style={buttonStyle}>
          <FaUserPlus /> Register
        </Link>
      </div>
    );
  };

  return (
    <nav style={navStyle}>
      <Link to="/" style={{ ...linkStyle, fontSize: '1.5rem', fontWeight: 'bold' }}>
        Dress Shop
      </Link>
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <Link to="/" style={linkStyle}>Home</Link>
        <Link to="/deals" style={linkStyle}>Deals</Link>
        {renderAuthButtons()}
      </div>
    </nav>
  );
};

export default Navbar; 