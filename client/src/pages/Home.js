import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [menProducts, setMenProducts] = useState([]);
  const [womenProducts, setWomenProducts] = useState([]);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const selectedCategory = searchParams.get('category');
  
  // Pagination states
  const [menPage, setMenPage] = useState(1);
  const [hasMoreMen, setHasMoreMen] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchMenProducts = useCallback(async (page) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/products?category=men&page=${page}&limit=10`
      );
      
      if (page === 1) {
        setMenProducts(res.data.products);
      } else {
        setMenProducts(prev => [...prev, ...res.data.products]);
      }
      
      setHasMoreMen(page < res.data.totalPages);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching men\'s products:', err);
      setLoading(false);
    }
  }, []);

  const fetchWomenProducts = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/products?category=women`
      );
      setWomenProducts(res.data.products);
    } catch (err) {
      console.error('Error fetching women\'s products:', err);
    }
  };

  useEffect(() => {
    fetchMenProducts(1);
    fetchWomenProducts();
  }, [fetchMenProducts]);

  const loadMoreMen = () => {
    if (!loading && hasMoreMen) {
      setMenPage(prev => prev + 1);
      fetchMenProducts(menPage + 1);
    }
  };

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find(item => item._id === product._id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    navigate('/cart');
  };

  return (
    <div style={styles.container}>
      <div style={styles.categories}>
        <Link 
          to="/?category=men" 
          style={{
            ...styles.categoryLink,
            ...(selectedCategory === 'men' ? styles.activeCategory : {})
          }}
        >
          Men's Collection
        </Link>
        <Link 
          to="/?category=women"
          style={{
            ...styles.categoryLink,
            ...(selectedCategory === 'women' ? styles.activeCategory : {})
          }}
        >
          Women's Collection
        </Link>
      </div>

      <div style={styles.productsGrid}>
        {selectedCategory === 'women' ? (
          womenProducts.map(product => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          menProducts.map(product => (
            <ProductCard key={product._id} product={product} />
          ))
        )}
      </div>

      {selectedCategory === 'men' && hasMoreMen && (
        <div style={styles.loadMoreContainer}>
          <button 
            onClick={loadMoreMen} 
            disabled={loading}
            style={styles.loadMoreButton}
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
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
  categories: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginBottom: '30px'
  },
  categoryLink: {
    padding: '10px 20px',
    textDecoration: 'none',
    color: '#4a5568',
    fontSize: '1.1rem',
    fontWeight: '500',
    borderRadius: '4px',
    transition: 'all 0.2s',
    ':hover': {
      backgroundColor: '#f7fafc'
    }
  },
  activeCategory: {
    color: '#4CAF50',
    borderBottom: '2px solid #4CAF50'
  },
  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
  },
  loadMoreContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px'
  },
  loadMoreButton: {
    padding: '10px 20px',
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
    },
    ':disabled': {
      backgroundColor: '#a0aec0',
      cursor: 'not-allowed'
    }
  }
};

export default Home; 