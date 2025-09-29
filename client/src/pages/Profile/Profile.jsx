import React, { useState, useEffect } from 'react';
import { usersAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import defaultPng from '../../assets/default-avatar.jpg'
import './Profile.css'

const Profile = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [avatarFile, setAvatarFile] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) fetchProfile();
    }, [user]);

    const fetchProfile = async () => {
        try {
            const res = await usersAPI.get(user.id);
            setProfile(res.data);
        } catch (error) {
            toast.error('Ошибка загрузки профиля');
        }
    };

    const handleAvatarChange = (e) => {
        setAvatarFile(e.target.files[0]);
    };

    const handleAvatarUpload = async (e) => {
        e.preventDefault();
        if (!avatarFile) return;
        setLoading(true);
        try {
            await usersAPI.uploadAvatar(user.id, avatarFile);
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
            await usersAPI.deleteAvatar(user.id);
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
                <input type="file" accept="image/*" onChange={handleAvatarChange} />
                <button type="submit" disabled={loading}>
                    {loading ? 'Загрузка...' : profile.avatar ? 'Сменить аватарку' : 'Добавить аватарку'}
                </button>
                {profile.avatar && (
                    <button
                        type="button"
                        onClick={handleDeleteAvatar}
                        disabled={loading}
                        style={{ marginLeft: 12, background: '#e74c3c' }}
                    >
                        Удалить аватарку
                    </button>
                )}
            </form>
        </div>
    );
};

export default Profile;