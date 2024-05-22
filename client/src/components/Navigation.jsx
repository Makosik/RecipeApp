import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LogoutButton from './LogoutButton';
import '../style/Navigation.css';

function Navigation() {
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
    const isAdmin = useSelector(state => state.auth.isAdmin);
    const userName = useSelector(state => state.auth.userName); // Предполагаем, что userName есть в auth state
    const [showDropdown, setShowDropdown] = useState(false);

    const handleMouseEnter = () => {
        setShowDropdown(true);
    };

    const handleMouseLeave = () => {
        setShowDropdown(false);
    };

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
                <li onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    {isLoggedIn ? (
                        <div className="user-menu">
                            <button>Привет, {userName}</button>
                            {showDropdown && (
                                <div className="dropdown-menu">
                                    <LogoutButton />
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to="/login"><button>Вход</button></Link>
                    )}
                </li>
            </ul>
        </nav>
    );
}

export default Navigation;
