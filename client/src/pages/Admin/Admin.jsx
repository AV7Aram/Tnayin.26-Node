import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ProductCard from '../../components/Products/ProductCard';
import ProductForm from '../../components/Admin/ProductForm';
import { productsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './Admin.css';

const Admin = () => {
    const [products, setProducts] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const { isAdmin } = useAuth();

    useEffect(() => {
        if (isAdmin) {
            fetchProducts();
        }
    }, [isAdmin]);

    const fetchProducts = async () => {
        try {
            const response = await productsAPI.getAll();
            setProducts(response.data);
        } catch (error) {
            toast.error('Ошибка загрузки товаров');
        }
    };

    const handleCreateProduct = async (productData) => {
        try {
            await productsAPI.create(productData);
            toast.success('Товар добавлен');
            setShowForm(false);
            fetchProducts();
        } catch (error) {
            toast.error('Ошибка добавления товара');
        }
    };

    const handleEditProduct = async (productData) => {
        try {
            await productsAPI.update(editingProduct._id, productData);
            toast.success('Товар обновлен');
            setEditingProduct(null);
            fetchProducts();
        } catch (error) {
            toast.error('Ошибка обновления товара');
        }
    };

    const handleDeleteProduct = async (productId) => {
        if (window.confirm('Удалить товар?')) {
            try {
                await productsAPI.delete(productId);
                toast.success('Товар удален');
                fetchProducts();
            } catch (error) {
                toast.error('Ошибка удаления товара');
            }
        }
    };

    if (!isAdmin) {
        return <div className="access-denied">Доступ запрещен</div>;
    }

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1>Панель администратора</h1>
                <button
                    onClick={() => setShowForm(true)}
                    className="add-product-btn"
                >
                    + Добавить товар
                </button>
            </div>

            <div className="products-grid">
                {products.map(product => (
                    <ProductCard
                        key={product._id}
                        product={product}
                        onEdit={setEditingProduct}
                        onDelete={handleDeleteProduct}
                    />
                ))}
            </div>

            {showForm && (
                <ProductForm
                    onSubmit={handleCreateProduct}
                    onCancel={() => setShowForm(false)}
                />
            )}

            {editingProduct && (
                <ProductForm
                    product={editingProduct}
                    onSubmit={handleEditProduct}
                    onCancel={() => setEditingProduct(null)}
                />
            )}
        </div>
    );
};

export default Admin;