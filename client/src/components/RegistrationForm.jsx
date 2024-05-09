import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../redux/authSlice';

function RegistrationForm() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
      user_name: "",
      mail: "",
      user_password: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("/api/auth/register",formData);
            const loginResponse = await axios.post("/api/auth/login", formData);
            localStorage.setItem('token', loginResponse.data.token);
            const { userId, userName, email, isAdmin } = loginResponse.data;
            dispatch(login({ userId, userName, email, isAdmin }));
            navigate('/recipes')
            console.log('Пользователь успешно зарегистрирован:', response);
        } catch (error) {
            console.error('Ошибка при регистрации пользователя:', error.message);

        }
    };

    return (
        <div>
            <h2>Регистрация</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Имя пользователя:</label>
                    <input type="text" name="user_name" value={formData.user_name} onChange={handleChange} />
                </div>
                <div>
                    <label>Email:</label>
                    <input type="email" name="mail" value={formData.mail} onChange={handleChange} />
                </div>
                <div>
                    <label>Пароль:</label>
                    <input type="password" name="user_password" value={formData.user_password} onChange={handleChange} />
                </div>
                <button type="submit">Зарегистрироваться</button>
                <br />
                <p>Есть аккаунт?</p>
                <Link to="/login">Войти</Link>
            </form>
        </div>
    );
}

export default RegistrationForm;
