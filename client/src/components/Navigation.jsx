import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LogoutButton from './LogoutButton';
import '../style/Navigation.css'

function Navigation() {
   const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
   const isAdmin = useSelector(state => state.auth.isAdmin);
    return (
        <nav>
            <ul>
                <li>
                    <Link to="/"><button>Рецепты</button></Link>
                </li>
                {!isAdmin && <li>
                  <Link to="/favorites"><button>Избранное</button></Link>
                </li>}
                {isAdmin && <li>
                <Link to="/show-orders"><button>Заявки</button></Link>
                </li>}
                {isAdmin && <li>
                <Link to="/users"><button>Пользователи</button></Link>
                </li>}
                <li>
                   <Link to="/create-recipe"><button>Добавить рецепт</button></Link>
                </li>
                <li>
                {isLoggedIn ? <LogoutButton/> : <Link to="/login"><button>Вход</button></Link>}
                </li>
            </ul>
        </nav>
    );
}

export default Navigation;