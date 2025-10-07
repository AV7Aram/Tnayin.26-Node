import React, { useState, useEffect, useRef } from 'react';
import { usersAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import defaultPng from '../../assets/avatar-default-icon.png'
import './Profile.css'

const Profile = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [avatarFile, setAvatarFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const inputFileRef = useRef(null);
    const fileLabelRef = useRef(null);

    useEffect(() => {
        if (user) fetchProfile();
    }, [user]);

    const fetchProfile = async () => {
        try {
            const res = await usersAPI.get(); 
            setProfile(res.data);
        } catch (error) {
            toast.error('Ошибка загрузки профиля');
        }
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file && file.size > 10 * 1024 * 1024) {
            toast.error('Файл слишком большой. Максимальный размер 10MB.');
            return;
        }
        setAvatarFile(file);
        updateFileLabel(e.target.files);
    };

    const updateFileLabel = (files) => {
        const label = fileLabelRef.current;
        const labelVal = label.querySelector('.field__file-fake').innerText;
        let countFiles = '';
        if (files && files.length >= 1) countFiles = files.length;
        if (countFiles)
            label.querySelector('.field__file-fake').innerText = `Выбрано файлов: ${countFiles}`;
        else
            label.querySelector('.field__file-fake').innerText = labelVal;
    };

    const handleAvatarUpload = async (e) => {
        e.preventDefault();
        if (!avatarFile) return;
        setLoading(true);
        try {
            await usersAPI.uploadAvatar(avatarFile);
            toast.success('Аватарка обновлена!');
            fetchProfile();
        } catch (error) {
            toast.error('Ошибка загрузки аватарки');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAvatar = async () => {
        setLoading(true);
        try {
            await usersAPI.deleteAvatar(); 
            toast.success('Аватарка удалена!');
            fetchProfile();
        } catch (error) {
            toast.error('Ошибка удаления аватарки');
        } finally {
            setLoading(false);
        }
    };

    if (!profile) return <div>Загрузка...</div>;

    return (
        <div className="profile-page">
            <h2>Профиль пользователя</h2>
            <div className="profile-info">
                <img
                    src={profile.avatar ? `http://localhost:5000${profile.avatar}` : defaultPng}
                    alt="avatar"
                    className="profile-avatar"
                    style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover' }}
                />
                <div className='user-info'>
                    <p><b>Имя:</b> {profile.username}</p>
                    <p><b>Email:</b> {profile.email}</p>
                    <p><b>Role:</b> {profile.role}</p>
                </div>
            </div>
            <form onSubmit={handleAvatarUpload} className="avatar-form">
                <div className="field__wrapper">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        id="field__file-2"
                        className="field field__file"
                        ref={inputFileRef}
                    />
                    <label className="field__file-wrapper" htmlFor="field__file-2" ref={fileLabelRef}>
                        <div className="field__file-fake">Файл не выбран</div>
                        <div className="field__file-button">Выбрать</div>
                    </label>
                    {profile.avatar && (
                        <button
                            type="button"
                            onClick={handleDeleteAvatar}
                            disabled={loading}
                            style={{ marginRight: 12, background: '#e74c3c' }}
                        >
                            Удалить аватарку
                        </button>
                    )}
                    <button type="submit" disabled={loading}>
                        {loading ? 'Загрузка...' : profile.avatar ? 'Сменить аватарку' : 'Добавить аватарку'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Profile;