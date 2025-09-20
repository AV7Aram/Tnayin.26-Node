import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Home.css';

const Home = () => {
    const { isAuthenticated, user } = useAuth();

    return (
        <div className="home-page">
            <div className="hero-section">
                <div className="hero-content">
                    <h1>Добро пожаловать в E-Shop</h1>
                    <p>Лучший интернет-магазин с широким ассортиментом товаров</p>

                    {isAuthenticated ? (
                        <div className="welcome-user">
                            <h2>Привет, {user.email}!</h2>
                            <p>Рады снова видеть вас в нашем магазине</p>
                        </div>
                    ) : (
                        <div className="auth-promo">
                            <p>Войдите или зарегистрируйтесь для начала покупок</p>
                        </div>
                    )}

                    <div className="hero-actions">
                        <Link to="/products" className="cta-button">
                            Начать покупки
                        </Link>
                        {!isAuthenticated && (
                            <Link to="/register" className="cta-button secondary">
                                Зарегистрироваться
                            </Link>
                        )}
                    </div>
                </div>

                <div className="hero-image">
                    <div className="floating-products">
                        <div className="product-icon">🛒</div>
                        <div className="product-icon">📱</div>
                        <div className="product-icon">💻</div>
                        <div className="product-icon">🎧</div>
                    </div>
                </div>
            </div>

            <div className="features-section">
                <h2>Почему выбирают нас?</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">🚚</div>
                        <h3>Быстрая доставка</h3>
                        <p>Доставка по всему городу за 24 часа</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">💯</div>
                        <h3>Гарантия качества</h3>
                        <p>Все товары проходят строгий контроль</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">🛡️</div>
                        <h3>Безопасная оплата</h3>
                        <p>Защищенные платежные системы</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">📞</div>
                        <h3>Поддержка 24/7</h3>
                        <p>Всегда готовы помочь вам</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;