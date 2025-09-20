import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { cartAPI } from '../../services/api';
import './Cart.css';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isAuthenticated, user } = useAuth();

    useEffect(() => {
        if (isAuthenticated && user) {
            fetchCart();
        }
    }, [isAuthenticated, user]);

    const fetchCart = async () => {
        try {
            const response = await cartAPI.getCart(user.id);
            setCartItems(response.data.items || []);
        } catch (error) {
            console.error('Error fetching cart:', error);
            toast.error('Ошибка загрузки корзины');
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (productId, newQuantity) => {
        if (newQuantity < 1) return;

        const updatedItems = cartItems.map(item =>
            item.productId === productId ? { ...item, quantity: newQuantity } : item
        );

        try {
            await cartAPI.updateCart(user.id, updatedItems);
            setCartItems(updatedItems);
            toast.success('Корзина обновлена');
        } catch (error) {
            console.error('Error updating cart:', error);
            toast.error('Ошибка обновления корзины');
        }
    };

    const removeItem = async (productId) => {
        const updatedItems = cartItems.filter(item => item.productId !== productId);

        try {
            await cartAPI.updateCart(user.id, updatedItems);
            setCartItems(updatedItems);
            toast.success('Товар удален из корзины');
        } catch (error) {
            console.error('Error removing item:', error);
            toast.error('Ошибка удаления товара');
        }
    };

    const getTotalPrice = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    if (!isAuthenticated) {
        return (
            <div className="cart-page">
                <div className="auth-required">
                    <h2>Для просмотра корзины необходимо войти в аккаунт</h2>
                    <p>Пожалуйста, войдите или зарегистрируйтесь</p>
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

    return (
        <div className="cart-page">
            <div className="cart-header">
                <h1>Корзина покупок</h1>
                <span className="items-count">{cartItems.length} товаров</span>
            </div>

            <div className="cart-content">
                <div className="cart-items">
                    {cartItems.map(item => (
                        <div key={item.productId} className="cart-item">
                            <div className="item-image">
                                <img src={item.image || '/placeholder-product.jpg'} alt={item.name} />
                            </div>

                            <div className="item-details">
                                <h3 className="item-name">{item.name}</h3>
                                <p className="item-price">{item.price} ₽</p>
                            </div>

                            <div className="item-quantity">
                                <button
                                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                    className="quantity-btn"
                                >
                                    -
                                </button>
                                <span className="quantity">{item.quantity}</span>
                                <button
                                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                    className="quantity-btn"
                                >
                                    +
                                </button>
                            </div>

                            <div className="item-total">
                                {item.price * item.quantity} ₽
                            </div>

                            <button
                                onClick={() => removeItem(item.productId)}
                                className="remove-btn"
                            >
                                🗑️
                            </button>
                        </div>
                    ))}
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