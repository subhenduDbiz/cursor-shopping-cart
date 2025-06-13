import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (token) {
        try {
          const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/auth/me`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            // If token is invalid, clear it
            localStorage.removeItem('token');
            setUser(null);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          localStorage.removeItem('token');
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    };

    fetchUserData();

    // Add event listener for storage changes
    const handleStorageChange = (e) => {
      if (e.key === 'token') {
        fetchUserData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
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

  const userProfileStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px 12px',
    borderRadius: '4px',
    backgroundColor: 'rgba(255,255,255,0.1)'
  };

  const profileImageStyle = {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid #fff'
  };

  const getProfileImageUrl = (profileImage) => {
    if (!profileImage) {
      return `${process.env.REACT_APP_API_BASE_URL}/uploads/profile-images/default-avatar.png`;
    }
    return `${process.env.REACT_APP_API_BASE_URL}${profileImage}`;
  };

  return (
    <nav style={navStyle}>
      <Link to="/" style={brandStyle}>Dress Shop</Link>
      
      <div style={{ display: 'flex', gap: '16px', marginRight: 'auto' }}>
        <Link to="/?category=men" style={linkStyle}>Men's Collection</Link>
        <Link to="/?category=women" style={linkStyle}>Women's Collection</Link>
        <Link to="/deals" style={linkStyle}>Special Deals</Link>
      </div>

      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <Link to="/cart" style={linkStyle}>Cart</Link>
        {!isLoading && (
          token && user ? (
            <>
              <div style={userProfileStyle}>
                <img 
                  src={getProfileImageUrl(user.profileImage)} 
                  alt="Profile" 
                  style={profileImageStyle}
                />
                <span>Welcome, {user.name}</span>
              </div>
              <Link to="/my-account" style={linkStyle}>My Account</Link>
              <button onClick={handleLogout} style={buttonStyle}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={linkStyle}>Login</Link>
              <Link to="/register" style={linkStyle}>Register</Link>
            </>
          )
        )}
      </div>
    </nav>
  );
};

export default Navbar; 