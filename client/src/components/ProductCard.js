import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
    const { addToCart, isInCart } = useCart();
    const isProductInCart = isInCart(product._id);

    return (
        <div style={styles.card}>
            <Link to={`/product/${product._id}`} style={styles.imageLink}>
                <img
                    src={product.images[0]}
                    alt={product.name}
                    style={styles.image}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/300x400?text=No+Image';
                    }}
                />
            </Link>
            <div style={styles.content}>
                <Link to={`/product/${product._id}`} style={styles.title}>
                    {product.name}
                </Link>
                <p style={styles.price}>${product.price}</p>
                <button
                    onClick={() => addToCart(product)}
                    disabled={isProductInCart}
                    style={{
                        ...styles.addToCartButton,
                        ...(isProductInCart ? styles.disabledButton : {})
                    }}
                >
                    {isProductInCart ? 'Added to Cart' : 'Add to Cart'}
                </button>
            </div>
        </div>
    );
};

const styles = {
    card: {
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        transition: 'transform 0.2s',
        ':hover': {
            transform: 'translateY(-4px)'
        }
    },
    imageLink: {
        display: 'block',
        width: '100%',
        height: '200px',
        overflow: 'hidden'
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        transition: 'transform 0.2s',
        ':hover': {
            transform: 'scale(1.05)'
        }
    },
    content: {
        padding: '1rem'
    },
    title: {
        fontSize: '1rem',
        fontWeight: '500',
        color: '#2d3748',
        textDecoration: 'none',
        display: 'block',
        marginBottom: '0.5rem',
        ':hover': {
            color: '#4a5568'
        }
    },
    price: {
        fontSize: '1.25rem',
        fontWeight: 'bold',
        color: '#2d3748',
        marginBottom: '1rem'
    },
    addToCartButton: {
        width: '100%',
        padding: '0.75rem',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: '500',
        transition: 'background-color 0.2s',
        ':hover': {
            backgroundColor: '#45a049'
        }
    },
    disabledButton: {
        backgroundColor: '#a0aec0',
        cursor: 'not-allowed',
        ':hover': {
            backgroundColor: '#a0aec0'
        }
    }
};

export default ProductCard; 