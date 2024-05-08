import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function RegistrationForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
      user_name: "",
      mail: "",
      user_password: ""
    });

    const handleChange = (e) => {
      console.log(e.target.name)
        setFormData({ ...formData, [e.target.name]: e.target.value });
        console.log(formData)
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("/api/auth/register",formData);
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
