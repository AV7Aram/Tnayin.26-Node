import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Layout.css';

const Layout = ({ children }) => {
    const { user, logout, isAdmin, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="layout">
            <header className="header">
                <nav className="nav">
                    <Link to="/" className="logo">
                        🛒 E-Shop
                    </Link>

                    <div className="nav-links">
                        <Link to="/products">Товары</Link>
                        <Link to="/cart">Корзина</Link>

                        {user ? (
                            <div className="user-menu">
                                {isAdmin && <Link to="/admin">Админка</Link>}
                                {isAuthenticated && (
                                    <span className="nav-user" onClick={() => navigate('/profile')}>
                                        Привет, {user.username}
                                    </span>
                                )}
                                <button onClick={handleLogout} className="logout-btn">
                                    Выйти
                                </button>
                            </div>
                        ) : (
                            <div className="auth-links">
                                <Link to="/login">Войти</Link>
                                <Link to="/register">Регистрация</Link>
                            </div>
                        )}
                    </div>
                </nav>
            </header>

            <main className="main-content">
                {children}
            </main>

            <footer className="footer">
                <p>&copy; 2024 E-Shop. Все права защищены.</p>
            </footer>
        </div>
    );
};

export default Layout;