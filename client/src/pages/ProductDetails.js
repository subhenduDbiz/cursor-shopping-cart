import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productAPI } from '../services/api';
import { useCart } from '../context/CartContext';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productAPI.getById(id);
        setProduct(response.data);
      } catch (err) {
        console.error('Error fetching product details:', err);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      navigate('/cart');
    }
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>{product.name}</h2>
      <img src={product.images[0]} alt={product.name} style={{ width: 300, height: 400, objectFit: 'cover', borderRadius: 8 }} />
      <p>{product.description}</p>
      <p>Price: ${product.price}</p>
      <label>Quantity: <input type="number" min={1} value={quantity} onChange={e => setQuantity(Number(e.target.value))} /></label>
      <button onClick={handleAddToCart} style={{ marginLeft: 10 }}>Add to Cart</button>
    </div>
  );
};

export default ProductDetails; 