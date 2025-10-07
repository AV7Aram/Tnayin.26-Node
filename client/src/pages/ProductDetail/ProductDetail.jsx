import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsAPI, cartAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await productsAPI.getById(id);
      setProduct(response.data);
    } catch (error) {
      toast.error('Ошибка загрузки товара');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    try {
      await cartAPI.addToCart(product._id, quantity);
      toast.success(`${product.name} добавлен в корзину!`);
    } catch (error) {
      toast.error('Ошибка добавления в корзину');
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/placeholder-product.jpg';
    
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    if (imagePath.startsWith('/uploads')) {
      return `http://localhost:5000${imagePath}`;
    }
    
    return imagePath;
  };

  const allImages = product ? [
    product.image,
    ...(product.additionalImages || [])
  ].filter(img => img && img.trim() !== '').map(img => getImageUrl(img)) : [];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  if (loading) return <div className="loading">Загрузка...</div>;
  if (!product) return <div className="error">Товар не найден</div>;

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        <div className="product-images">
          <div className="main-image-container">
            {allImages.length > 0 ? (
              <img 
                src={allImages[currentImageIndex]} 
                alt={product.name}
                className="main-image"
                onError={(e) => {
                  console.error('Error loading image:', allImages[currentImageIndex]);
                  e.target.src = '/placeholder-product.jpg';
                }}
              />
            ) : (
              <div className="no-image">Нет изображения</div>
            )}
            
            {allImages.length > 1 && (
              <>
                <button className="nav-btn prev-btn" onClick={prevImage}>‹</button>
                <button className="nav-btn next-btn" onClick={nextImage}>›</button>
              </>
            )}
          </div>
          
          {allImages.length > 1 && (
            <div className="thumbnail-container">
              {allImages.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                  onClick={() => setCurrentImageIndex(index)}
                  onError={(e) => {
                    console.error('Error loading thumbnail:', image);
                    e.target.src = '/placeholder-product.jpg';
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <div className="product-info-detail">
          <h1 className="product-title">{product.name}</h1>
          <p className="product-description-detail">{product.description}</p>
          
          <div className="product-specs">
            <div className="spec-item">
              <span className="spec-label">Категория:</span>
              <span className="spec-value">{product.category}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">В наличии:</span>
              <span className="spec-value">{product.stock} шт.</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Цена:</span>
              <span className="spec-value price">{product.price} ₽</span>
            </div>
          </div>

          {isAuthenticated && !isAdmin && (
            <div className="purchase-section">
              <div className="quantity-selector">
                <span className="quantity-label">Количество:</span>
                <div className="quantity-controls">
                  <button 
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="quantity-btn"
                  >
                    -
                  </button>
                  <span className="quantity-display">{quantity}</span>
                  <button 
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                    className="quantity-btn"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="add-to-cart-btn-detail"
              >
                {product.stock === 0 ? 'Нет в наличии' : `Добавить в корзину - ${product.price * quantity} ₽`}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;