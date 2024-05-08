import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAuthenticated } from '../redux/authSlice';

function LoginForm() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
      mail: '',
      user_password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

//     const handleLogout = () => {  //ДОПИСАТЬ ВЫХОД НА СЕРВЕРЕ!
//       setAuthenticated(false);
//       navigate('/login');
//   };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/auth/login', formData);
            navigate('/recipes');
            dispatch(setAuthenticated(true));
            console.log('Пользователь успешно аутентифицирован:', response);
        } catch (error) {
            console.error('Ошибка при аутентификации пользователя:', error.message);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
            <h2>Вход</h2>
                <div>
                    <label>Email:</label>
                    <input type="email" name="mail" value={formData.mail} onChange={handleChange} />
                </div>
                <div>
                    <label>Пароль:</label>
                    <input type="password" name="user_password" value={formData.user_password} onChange={handleChange} />
                </div>
                <button type="submit">Войти</button>
                <br />
                <span>Нет аккаунта?</span>
                <Link to="/register">Зарегистрироваться</Link>
            </form>
        </div>
    );
}

export default LoginForm;