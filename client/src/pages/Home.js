import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

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

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreMen && !loading) {
          setMenPage(prev => prev + 1);
          fetchMenProducts(menPage + 1);
        }
      },
      { threshold: 1.0 }
    );

    const loadMoreTrigger = document.getElementById('load-more-trigger');
    if (loadMoreTrigger) {
      observer.observe(loadMoreTrigger);
    }

    return () => {
      if (loadMoreTrigger) {
        observer.unobserve(loadMoreTrigger);
      }
    };
  }, [hasMoreMen, loading, menPage, fetchMenProducts]);

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

  const ProductCard = ({ product }) => (
    <div key={product._id} style={{ border: '1px solid #ccc', borderRadius: 8, padding: 16, width: 220 }}>
      <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 4 }} />
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
        <Link to={`/product/${product._id}`} style={{ 
          padding: '8px 12px', 
          backgroundColor: '#f0f0f0', 
          borderRadius: '4px',
          textDecoration: 'none',
          color: '#333'
        }}>
          View Details
        </Link>
        <button 
          onClick={() => addToCart(product)}
          style={{
            padding: '8px 12px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ padding: 20 }}>
      {(!selectedCategory || selectedCategory === 'men') && (
        <section style={{ marginBottom: 40 }}>
          <h2>Men's Collection</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
            {menProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          {hasMoreMen && (
            <div 
              id="load-more-trigger" 
              style={{ 
                height: '20px', 
                margin: '20px 0',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              {loading && <div>Loading more products...</div>}
            </div>
          )}
        </section>
      )}

      {(!selectedCategory || selectedCategory === 'women') && (
        <section>
          <h2>Women's Collection</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
            {womenProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Home; 