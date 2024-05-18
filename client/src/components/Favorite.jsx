import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navigation from './Navigation';
import { useNavigate } from 'react-router-dom';

const Favorite = () => {
   const [favorites, setFavorites] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const navigate = useNavigate();

   const fetchFavorites = async () => {
      try {
         const token = localStorage.getItem('token');
         const config = {
            headers: {
               'Authorization': `Bearer ${token}`
            }
         };
         const response = await axios.get('/api/favorites', config);
         setFavorites(response.data.rows);
         setLoading(false);
      } catch (err) {
         setError('Ошибка при получении избранных рецептов');
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchFavorites();
   }, []);

   const handleCardClick = (dish_id) => {
      navigate(`/dishes/${dish_id}`);
   };

   const handleDeleteFavorite = async (dish_id) => {
      try {
         const token = localStorage.getItem('token');
         const config = {
            headers: {
               'Authorization': `Bearer ${token}`
            }
         };
         await axios.delete(`/api/favorites/${dish_id}`, config);
         fetchFavorites();
      } catch (error) {
         console.error('Ошибка при удалении рецепта из избранного:', error.response.data.message);
      }
   };

   if (loading) return <p>Загрузка...</p>;
   if (error) return <p>{error}</p>;

console.log(favorites)

   return (
      <div className='wrapper '>
         <Navigation />
         <h1>Избранные рецепты</h1>
         <div className="recipe-cards">
            {favorites.map((item) => (
               <div className="recipe-card" key={item.dish_id} onClick={() => handleCardClick(item.dish_id)}>
                  <img src={`http://localhost:3000/${item.coverphoto}`} alt={item.dish_title}  />
                  <h3>{item.dish_title}</h3>
                  <p>{item.description}</p>
                  <div className="card-buttons">
                     <button onClick={(e) => {
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
