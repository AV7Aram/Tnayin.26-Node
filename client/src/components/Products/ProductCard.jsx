import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { cartAPI } from '../../services/api';
import { toast } from 'react-toastify';
import productIcon from '../../assets/product-icon.png'
import './ProductCard.css';

const ProductCard = ({ product, onEdit, onDelete, onAddImage }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    try {
      await cartAPI.addToCart(product._id, 1);
      toast.success(`${product.name} добавлен в корзину!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Ошибка добавления в корзину');
    }
  };

  const handleImageClick = () => {
    navigate(`/product/${product._id}`);
  };

  const handleAddImageClick = (e) => {
    e.stopPropagation();
    onAddImage(product);
  };

  const getImageUrl = () => {
    if (!product.image) return productIcon;
    if (product.image.startsWith('http')) {
      return product.image;
    }
    if (product.image.startsWith('/uploads')) {
      return `http://localhost:5000${product.image}`;
    }
    return product.image;
  };
  
  return (
    <div className="product-card">
      <div className="product-image clickable" onClick={handleImageClick}>
        <img 
          src={getImageUrl()} 
          alt={product.name} 
          className={product.name}
          onError={(e) => {
            console.error('Error loading product image:', product.image);
            e.target.src = productIcon;
          }}
        />
      </div>

      <div className="product-info">
        <h3 className="product-name clickable" onClick={handleImageClick}>
          {product.name}
        </h3>
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
              {product.image && (
                <button onClick={handleAddImageClick} className="image-btn" title="Добавить изображение">
                  🖼️
                </button>
              )}
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