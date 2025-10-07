import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { cartAPI } from '../../services/api';
import './Cart.css';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isAuthenticated, user, isAdmin } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated && !isAdmin) {
            fetchCart();
        } else {
            setLoading(false);
        }
    }, [isAuthenticated, isAdmin]);

    const fetchCart = async () => {
        try {
            const response = await cartAPI.getCart();
            console.log('Cart response:', response.data);

            const items = (response.data?.items || []).map(item => {
                const productId = item.productId?._id || item.productId;

                return {
                    ...item,
                    productId: productId,
                    ...(item.productId || {}),
                };
            });

            console.log('Processed cart items:', items);
            setCartItems(items);
        } catch (error) {
            console.error('Error fetching cart:', error);
            toast.error('Ошибка загрузки корзины');
        } finally {
            setLoading(false);
        }
    };

    const handleProductClick = (productId) => {
        console.log('Product clicked:', productId);

        if (productId && typeof productId === 'string') {
            navigate(`/product/${productId}`);
        } else {
            console.error('Invalid productId:', productId);
            toast.error('Ошибка перехода к товару');
        }
    };


    const getProductId = (item) => {
        if (typeof item.productId === 'string') {
            return item.productId;
        }
        if (item.productId && item.productId._id) {
            return item.productId._id;
        }
        if (item._id) {
            return item._id;
        }
        console.error('Cannot get productId from item:', item);
        return null;
    };

    const getProductName = (item) => {
        return item.name || item.productId?.name || 'Неизвестный товар';
    };

    const getProductPrice = (item) => {
        return item.price || item.productId?.price || 0;
    };

    const getProductImage = (item) => {
        const image = item.image || item.productId?.image;
        if (!image) return '/placeholder-product.jpg';

        if (image.startsWith('http')) {
            return image;
        }
        if (image.startsWith('/uploads')) {
            return `http://localhost:5000${image}`;
        }
        return image;
    };

    if (!isAuthenticated) {
        return (
            <div className="cart-page">
                <div className="auth-required">
                    <h2>Для просмотра корзины необходимо войти в аккаунт</h2>
                    <p>Пожалуйста, войдите или зарегистрируйтесь</p>
                    <div className="auth-actions" style={{ marginTop: '20px', display: 'flex', gap: '15px', justifyContent: 'center' }}>
                        <Link to="/login" className="auth-button" style={{
                            padding: '12px 24px',
                            background: '#3498db',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '8px',
                            fontWeight: 'bold'
                        }}>
                            Войти
                        </Link>
                        <Link to="/register" className="auth-button" style={{
                            padding: '12px 24px',
                            background: '#2ecc71',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '8px',
                            fontWeight: 'bold'
                        }}>
                            Зарегистрироваться
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
    if (isAdmin) {
        return (
            <div className="cart-page">
                <div className="admin-no-cart">
                    <span className="admin-icon">👑</span>
                    <h2>У администратора нет корзины</h2>
                    <p>Администратор управляет товарами и заказами, но не совершает покупки.</p>
                </div>
            </div>
        );
    }
    if (loading) {
        return <div className="loading">Загрузка корзины...</div>;
    }

    if (cartItems.length === 0) {
        return (
            <div className="cart-page">
                <div className="empty-cart">
                    <h2>Корзина пуста</h2>
                    <p>Добавьте товары из каталога</p>
                </div>
            </div>
        );
    }

    const updateQuantity = async (productId, newQuantity) => {
        if (newQuantity < 1) return;

        const actualProductId = typeof productId === 'string' ? productId : productId._id;

        const updatedItems = cartItems.map(item =>
            getProductId(item) === actualProductId ? { ...item, quantity: newQuantity } : item
        );

        try {
            await cartAPI.updateCart(updatedItems);
            setCartItems(updatedItems);
            toast.success('Корзина обновлена');
        } catch (error) {
            console.error('Error updating cart:', error);
            toast.error('Ошибка обновления корзины');
        }
    };

    const removeItem = async (productId) => {
        const actualProductId = typeof productId === 'string' ? productId : productId._id;

        const updatedItems = cartItems.filter(item => getProductId(item) !== actualProductId);

        try {
            await cartAPI.updateCart(updatedItems);
            setCartItems(updatedItems);
            toast.success('Товар удален из корзины');
        } catch (error) {
            console.error('Error removing item:', error);
            toast.error('Ошибка удаления товара');
        }
    };

    const getTotalPrice = () => {
        return cartItems.reduce((total, item) => total + (getProductPrice(item) * item.quantity), 0);
    };

    return (
        <div className="cart-page">
            <div className="cart-header">
                <h1>Корзина покупок</h1>
                <span className="items-count">{cartItems.length} товаров</span>
            </div>

            <div className="cart-content">
                <div className="cart-items">
                    {cartItems.map((item, index) => {
                        const productId = getProductId(item);
                        const productName = getProductName(item);
                        const productPrice = getProductPrice(item);
                        const productImage = getProductImage(item);

                        if (!productId) {
                            console.error('Invalid item in cart:', item);
                            return null;
                        }

                        return (
                            <div key={`${productId}-${index}`} className="cart-item">
                                <div className="item-image">
                                    <img
                                        src={productImage}
                                        alt={productName}
                                        onClick={() => handleProductClick(productId)}
                                        style={{ cursor: 'pointer' }}
                                        onError={(e) => {
                                            e.target.src = '/placeholder-product.jpg';
                                        }}
                                    />
                                </div>
                                <div className="item-details">
                                    <h3
                                        className="item-name clickable"
                                        onClick={() => handleProductClick(productId)}
                                    >
                                        {productName}
                                    </h3>
                                    <p className="item-price">{productPrice} ₽</p>
                                </div>
                                <div className="item-quantity">
                                    <button
                                        onClick={() => updateQuantity(productId, item.quantity - 1)}
                                        className="quantity-btn"
                                        disabled={item.quantity <= 1}
                                    >-</button>
                                    <span className="quantity">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(productId, item.quantity + 1)}
                                        className="quantity-btn"
                                    >+</button>
                                </div>
                                <div className="item-total">
                                    {productPrice * item.quantity} ₽
                                </div>
                                <button
                                    onClick={() => removeItem(productId)}
                                    className="remove-btn"
                                >🗑️</button>
                            </div>
                        );
                    })}
                </div>

                <div className="cart-summary">
                    <div className="summary-card">
                        <h3>Итого</h3>

                        <div className="summary-row">
                            <span>Товары:</span>
                            <span>{getTotalPrice()} ₽</span>
                        </div>

                        <div className="summary-row">
                            <span>Доставка:</span>
                            <span>Бесплатно</span>
                        </div>

                        <div className="summary-divider"></div>

                        <div className="summary-row total">
                            <span>Общая сумма:</span>
                            <span>{getTotalPrice()} ₽</span>
                        </div>

                        <button className="checkout-btn">
                            Оформить заказ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;