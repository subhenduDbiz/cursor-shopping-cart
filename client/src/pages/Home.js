import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { productAPI } from '../services/api';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [menProducts, setMenProducts] = useState([]);
  const [womenProducts, setWomenProducts] = useState([]);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const selectedCategory = searchParams.get('category') || 'men'; // Default to men's category
  
  // Pagination states
  const [menPage, setMenPage] = useState(1);
  const [hasMoreMen, setHasMoreMen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const fetchMenProducts = useCallback(async (page) => {
    try {
      setLoading(true);
      const response = await productAPI.getAll({ category: 'men', page, limit: 10 });
      console.log('Men products response:', response.data);
      
      if (response.data && response.data.data) {
        const products = response.data.data.products || [];
        if (page === 1) {
          setMenProducts(products);
        } else {
          setMenProducts(prev => [...prev, ...products]);
        }
        setHasMoreMen(page < response.data.data.totalPages);
      } else {
        setMenProducts([]);
        setHasMoreMen(false);
      }
    } catch (err) {
      console.error('Error fetching men\'s products:', err);
      setMenProducts([]);
      setHasMoreMen(false);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, []);

  const fetchWomenProducts = async () => {
    try {
      setInitialLoading(true);
      const response = await productAPI.getAll({ category: 'women' });
      console.log('Women products response:', response.data);
      
      if (response.data && response.data.data) {
        setWomenProducts(response.data.data.products || []);
      } else {
        setWomenProducts([]);
      }
    } catch (err) {
      console.error('Error fetching women\'s products:', err);
      setWomenProducts([]);
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    console.log('Selected category:', selectedCategory);
    fetchMenProducts(1);
    fetchWomenProducts();
  }, [fetchMenProducts, selectedCategory]);

  const loadMoreMen = () => {
    if (!loading && hasMoreMen) {
      const nextPage = menPage + 1;
      setMenPage(nextPage);
      fetchMenProducts(nextPage);
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

  if (initialLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingText}>Loading products...</div>
      </div>
    );
  }

  const currentProducts = selectedCategory === 'women' ? womenProducts : menProducts;

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
        {currentProducts && currentProducts.length > 0 ? (
          currentProducts.map(product => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <div style={styles.noProducts}>No products found</div>
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
    transition: 'all 0.2s'
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
    transition: 'background-color 0.2s'
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '200px'
  },
  loadingText: {
    fontSize: '1.2rem',
    color: '#4a5568'
  },
  noProducts: {
    gridColumn: '1 / -1',
    textAlign: 'center',
    padding: '40px',
    fontSize: '1.2rem',
    color: '#4a5568'
  }
};

export default Home; 