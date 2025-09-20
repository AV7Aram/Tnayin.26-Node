import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ProductCard from '../../components/Products/ProductCard';
import { productsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productsAPI.getAll();
      setProducts(response.data);
    } catch (error) {
      toast.error('Ошибка загрузки товаров');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    toast.success(`${product.name} добавлен в корзину!`);
  };

  if (loading) return <div className="loading">Загрузка...</div>;

  return (
    <div className="products-page">
      <div className="products-header">
        <h1>Каталог товаров</h1>
        {isAdmin && (
          <button className="add-product-btn">
            Добавить товар
          </button>
        )}
      </div>

      <div className="products-grid">
        {products.map(product => (
          <ProductCard
            key={product._id}
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
    </div>
  );
};

export default Products;