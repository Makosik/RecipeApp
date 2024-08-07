import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navigation from '../components/Navigation';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite } from '.././redux/favoriteSlice';
import {
   getAccessToken,
   isTokenExpired,
   refreshAccessToken
 } from '../utils/authUtils';

const Favorite = () => {
   const [favorites, setFavorites] = useState([]);
   const [error, setError] = useState(null);
   const navigate = useNavigate();
   const dispatch = useDispatch();
   const userId = useSelector(state => state.auth.userId);
  
   const [accessToken, setAccessTokenState] = useState(getAccessToken());

   const fetchFavorites = async (currentToken) => {
     try {
       const config = {
         headers: {
           'Authorization': `Bearer ${currentToken}`
         }
       };
       const response = await axios.get('/api/favorites', config);
       setFavorites(response.data.rows);
     } catch (err) {
       setError('Ошибка при получении избранных рецептов');
     }
   };
 
   useEffect(() => {
      const fetchData = async () => {
         try {
            let currentToken = accessToken;
            if (accessToken && isTokenExpired(accessToken)) {
               currentToken = await refreshAccessToken();
               setAccessTokenState(currentToken);
            }
            fetchFavorites(currentToken);
         } catch (error) {
            setError('Ошибка при обновлении токена доступа');
         }
      };
      fetchData();
   }, [accessToken]);

   const handleCardClick = (dish_id) => {
      navigate(`/dishes/${dish_id}`);
   };

   const handleDeleteFavorite = async (dish_id) => {
      try {
         const token = getAccessToken();
         const config = {
            headers: {
               'Authorization': `Bearer ${token}`
            }
         };
         await axios.delete(`/api/favorites/${dish_id}`, config);
         dispatch(toggleFavorite({ userId, dishId: dish_id }));
         fetchFavorites(token);
         alert('Рецепт успешно удален из избранного')
      } catch (error) {
         console.error('Ошибка при удалении рецепта из избранного:', error.response.data.message);
      }
   };

   if (error) return <p>{error}</p>;

 

   return (
      <div className='wrapper '>
         <Navigation />
         <div className="recipe-cards">
            {favorites.map((item) => (
               <div className="recipe-card" key={item.dish_id} onClick={() => handleCardClick(item.dish_id)}>
                  <img src={`http://localhost:3000/${item.coverphoto}`} alt={item.dish_title} />
                  <h3>{item.dish_title}</h3>
                  <p className='recipe-card-desc'>{item.description}</p>
                  <div >
                     <button className="card-buttons-del" onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteFavorite(item.dish_id);
                     }}>
                        Удалить из избранного
                     </button>
                  </div>
               </div>
            ))}
         </div>
      </div>
   );
};

export default Favorite;
