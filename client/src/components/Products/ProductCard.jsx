import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { cartAPI } from '../../services/api';
import { toast } from 'react-toastify';
import './ProductCard.css';

const ProductCard = ({ product, onEdit, onDelete }) => {
  const { isAuthenticated, isAdmin, user } = useAuth();

  const handleAddToCart = async () => {
    try {
      const response = await cartAPI.addToCart(user.id, product._id, 1);
      if (response.data.success) {
        toast.success(`${product.name} добавлен в корзину!`);
      } else {
        toast.error('Ошибка добавления в корзину');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Ошибка добавления в корзину');
    }
  };

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={product.image || '/placeholder-product.jpg'} alt={product.name} />
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <p className="product-category">Категория: {product.category}</p>
        <p className="product-stock">В наличии: {product.stock} шт.</p>
        
        <div className="product-footer">
          <span className="product-price">{product.price} ₽</span>
          
          {isAuthenticated && !isAdmin && (
            <button 
              onClick={handleAddToCart}
              className="add-to-cart-btn"
              disabled={product.stock === 0}
            >
              {product.stock === 0 ? 'Нет в наличии' : 'В корзину'}
            </button>
          )}
          
          {isAdmin && (
            <div className="admin-actions">
              <button onClick={() => onEdit(product)} className="edit-btn">
                ✏️
              </button>
              <button onClick={() => onDelete(product._id)} className="delete-btn">
                🗑️
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;