import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './PasswordInput.css';

const PasswordInput = ({
    label,
    name,
    value,
    onChange,
    placeholder,
    required = false
}) => {
    const [showPassword, setShowPassword] = useState(false);

    const toggleVisibility = () => {
        setShowPassword(prev => !prev);
    };

    return (
        <div className="form-group password-group">
            {label && <label>{label}</label>}
            <div className="password-wrapper">
                <input
                    type={showPassword ? 'text' : 'password'}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                />
                <span
                    className="toggle-password"
                    onClick={toggleVisibility}
                    title={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
            </div>
        </div>
    );
};

export default PasswordInput;
