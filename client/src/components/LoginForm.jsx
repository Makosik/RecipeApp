import axios from 'axios';
import React, { useState } from 'react';

function LoginForm() {
    const [formData, setFormData] = useState({
      mail: '',
      user_password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/auth/login', formData);
            console.log('Пользователь успешно аутентифицирован:', response);
        } catch (error) {
            console.error('Ошибка при аутентификации пользователя:', error.message);
        }
    };

    return (
        <div>
            <h2>Вход</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input type="email" name="mail" value={formData.mail} onChange={handleChange} />
                </div>
                <div>
                    <label>Пароль:</label>
                    <input type="password" name="user_password" value={formData.user_password} onChange={handleChange} />
                </div>
                <button type="submit">Войти</button>
            </form>
        </div>
    );
}

export default LoginForm;