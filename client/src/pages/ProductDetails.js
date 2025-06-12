import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error('Error fetching product details:', err));
  }, [id]);

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find(item => item._id === product._id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    navigate('/cart');
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>{product.name}</h2>
      <img src={product.images[0]} alt={product.name} style={{ width: 300, height: 400, objectFit: 'cover', borderRadius: 8 }} />
      <p>{product.description}</p>
      <p>Price: ${product.price}</p>
      <label>Quantity: <input type="number" min={1} value={quantity} onChange={e => setQuantity(Number(e.target.value))} /></label>
      <button onClick={addToCart} style={{ marginLeft: 10 }}>Add to Cart</button>
    </div>
  );
};

export default ProductDetails; 