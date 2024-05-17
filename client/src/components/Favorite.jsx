import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navigation from './Navigation';

const Favorite = () => {
   const [favorites, setFavorites] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);

   const fetchFavorites = async () => {
      try {
         const token = localStorage.getItem('token');
         const config = {
            headers: {
               'Authorization': `Bearer ${token}`
            }
         };
         const response = await axios.get('/api/favorites',config);
         console.log(response.data.rows)
         setFavorites(response.data.rows);
         setLoading(false);
      } catch (err) {
         //setError('Ошибка при получении избранных рецептов');
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchFavorites();
   }, []);

   const randomNum = () => {
      let num = Math.floor(Math.random() * 10000)
      //console.log(num)
      return num;
    }

    const handleDeleteFavorite = async (dish_id) => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };
        const response = await axios.delete(`/api/favorites/${dish_id}`, config);
        fetchFavorites();
        console.log('Рецепт успешно удален из избранного:', response.data);
      } catch (error) {
        console.error('Ошибка при удалении рецепта из избранного:', error.response.data.message);
      }
    };

   if (loading) return <p>Загрузка...</p>;
   if (error) return <p>{error}</p>;

   return (
      <div>
         <Navigation />
         <h1>Избранные рецепты</h1>
         <div className="recipes">
         {favorites.map((item) => (
               <div key={randomNum()}>{item.dish_title}
                  <ul>
                     {item.ingredient_titles.map(ingr => (
                        <li key={randomNum()}>{ingr}</li>
                     ))}
                  </ul>
                  <div>Описание: {item.description}</div>
                  <div>
                  {item.step_numbers.map((stepNumber, index) => (
                     <li key={index}>
                        {`Шаг ${stepNumber}:`}
                        <br />
                        <img src={item.file_path[index]} alt="Фото шага" width={300} height={200} />
                        <div style={{ width: "300px", overflowWrap: "break-word" }}>{item.step_descriptions[index]}</div>
                     </li>
                  ))}
                  </div>
                  <br /><br />
                  <button type="button" onClick={() => handleDeleteFavorite(item.dish_id)}>Удалить из избранного</button>
               </div>
            ))}
         </div>
      </div>
   );
};

export default Favorite;
