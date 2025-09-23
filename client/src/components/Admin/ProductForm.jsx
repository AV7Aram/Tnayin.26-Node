import React, { useState } from 'react';
import './ProductForm.css';

const ProductForm = ({ product, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        name: product?.name || '',
        price: product?.price || '',
        category: product?.category || '',
        description: product?.description || '',
        stock: product?.stock || '',
        image: product?.image || ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const productData = {
            name: formData.name,
            price: Number(formData.price),
            description: formData.description,
            image: formData.image,
            category: formData.category,
            stock: Number(formData.stock),
        };
        onSubmit(productData);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="product-form-overlay">
            <div className="product-form">
                <h2>{product ? 'Редактировать товар' : 'Добавить товар'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Название:</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Цена:</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Категория:</label>
                        <input
                            type="text"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Описание:</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Количество:</label>
                        <input
                            type="number"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Изображение (URL):</label>
                        <input
                            type="url"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="submit-btn">
                            {product ? 'Обновить' : 'Добавить'}
                        </button>
                        <button type="button" onClick={onCancel} className="cancel-btn">
                            Отмена
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductForm;