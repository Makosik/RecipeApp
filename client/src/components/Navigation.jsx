import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Navigation() {
   const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    return (
        <nav>
            <ul>
                <li>
                    <Link to="/">Рецепты</Link>
                </li>
                <li>
                    <Link to="/favorites">Избранное</Link>
                </li>
                <li>
                    <Link to="/create-recipe">Добавить рецепт</Link>
                </li>
                <li>
                    <Link to="/login">{isAuthenticated ? "Выход" : "Вход"}</Link>
                </li>
            </ul>
        </nav>
    );
}

export default Navigation;