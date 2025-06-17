import React, { useEffect } from 'react';

const Message = ({ message, type = 'info', onClose }) => {
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000); // Auto close after 3 seconds

            return () => clearTimeout(timer);
        }
    }, [message, onClose]);

    if (!message) return null;

    const styles = {
        container: {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 25px',
            borderRadius: '4px',
            color: 'white',
            zIndex: 1000,
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            animation: 'slideIn 0.3s ease-out',
            backgroundColor: type === 'error' ? '#f44336' : 
                           type === 'success' ? '#4CAF50' : 
                           type === 'warning' ? '#ff9800' : '#2196F3',
            minWidth: '200px',
            maxWidth: '400px'
        },
        message: {
            margin: 0,
            fontSize: '14px',
            paddingRight: '20px' // Add space for the close button
        },
        closeButton: {
            position: 'absolute',
            top: '5px',
            right: '5px',
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            fontSize: '20px',
            padding: '0 5px',
            lineHeight: '1',
            opacity: '0.8',
            transition: 'opacity 0.2s',
            '&:hover': {
                opacity: '1'
            }
        }
    };

    const handleClose = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onClose();
    };

    return (
        <div style={styles.container}>
            <button 
                style={styles.closeButton}
                onClick={handleClose}
                aria-label="Close message"
            >
                ×
            </button>
            <p style={styles.message}>{message}</p>
        </div>
    );
};

export default Message; 