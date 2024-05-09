import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LogoutButton from './LogoutButton';

function Navigation() {
   const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

    return (
        <nav>
            <ul>
                <li>
                    <Link to="/"><button>Рецепты</button></Link>
                </li>
                <li>
                  <Link to="/favorites"><button>Избранное</button></Link>
                </li>
                <li>
                   <Link to="/create-recipe"><button>Добавить рецепт</button></Link>
                </li>
                <li>
                   <Link to="/show-orders"><button>Заявки</button></Link>
                </li>
                <li>
                {isLoggedIn ? <LogoutButton/> : <Link to="/login"><button>Вход</button></Link>}
                </li>
            </ul>
        </nav>
    );
}

export default Navigation;