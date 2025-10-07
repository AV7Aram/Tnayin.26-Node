import React, { useState, useRef } from 'react';
import './ImageUploadForm.css';

const ImageUploadForm = ({ product, onSubmit, onCancel }) => {
    const [file, setFile] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.size > 10 * 1024 * 1024) {
            alert('Файл слишком большой. Максимальный размер 10MB.');
            return;
        }
        setFile(selectedFile);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!file) {
            alert('Пожалуйста, выберите файл');
            return;
        }
        onSubmit(file);
    };

    return (
        <div className="image-upload-overlay">
            <div className="image-upload-form">
                <h2>Добавить изображение для {product.name}</h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Выберите изображение:</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            ref={fileInputRef}
                            required
                        />
                    </div>

                    {file && (
                        <div className="image-preview">
                            <img src={URL.createObjectURL(file)} alt="Preview" />
                        </div>
                    )}

                    <div className="form-actions">
                        <button type="submit" className="submit-btn">
                            Загрузить
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

export default ImageUploadForm;