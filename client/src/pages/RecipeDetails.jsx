import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Navigation from '../components/Navigation';
import '../style/RecipeDetails.css';
import LoginModal from '../components/LoginModal';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite, setFavorites } from '.././redux/favoriteSlice';


const RecipeDetails = () => {
   const isAdmin = useSelector(state => state.auth.isAdmin);
   const { id } = useParams();

   const [recipe, setRecipe] = useState(null);
   const navigate = useNavigate();
   const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
   const [showModal, setShowModal] = useState();
   const dispatch = useDispatch();
   const userId = useSelector(state => state.auth.userId);
   const isFavorite = useSelector(state => state.favorite[userId]?.[id]);

   console.log('isFavorite:', isFavorite)
   console.log('isUser:', userId)

   useEffect(() => {
      const fetchRecipeDetails = async () => {
         try {
            const token = localStorage.getItem('token');
            const config = {
               headers: {
                  'Authorization': `Bearer ${token}`
               }
            };

            const response = await axios.get(`/api/dishes/${id}`, config);
            const data = response.data;
            const steps = data.step_numbers.map((stepNumber, index) => ({
               step_number: stepNumber,
               step_description: data.step_descriptions[index],
               file_path: `http://localhost:3000/${data.file_path[index]}`
            }));

            const recipeData = {
               ...data,
               steps
            };
            setRecipe(recipeData);
            if (userId) {
               const responseFavorite = await axios.get('/api/favorites', config);
               const favArr = responseFavorite.data.rows.map(obj => obj.dish_id);
               dispatch(setFavorites({ userId, favArr }));
            }
         } catch (error) {
            console.error('Ошибка при загрузке деталей рецепта:', error);
         }
      };
      fetchRecipeDetails();
   }, [id, dispatch, userId]);



   const handleDeleteDish = async (dish_id) => {
      try {
         const token = localStorage.getItem('token');
         const config = {
            headers: {
               'Authorization': `Bearer ${token}`
            }
         };
         const response = await axios.delete(`/api/dishes/${dish_id}`, config);
         // fetchRecipeDetails();
         alert('Рецепт успешно удален')
         navigate('/')
         console.log('Рецепт успешно удален:', response.data);
      } catch (error) {
         console.error('Ошибка при удалении рецепта:', error.response.data.message);
      }
   };

   const handleAddFavorite = async (dish_id) => {
      console.log(dish_id)
      if (isLoggedIn) {
         try {
            const token = localStorage.getItem('token');
            const config = {
               headers: {
                  'Authorization': `Bearer ${token}`
               }
            };
            const response = await axios.post('/api/addFavorite', { dish_id }, config);
            alert('Рецепт успешно добавлен в избранное')
            dispatch(toggleFavorite({ userId, dishId: dish_id }));
            //navigate('/favorite');
            console.log('Рецепт успешно добавлен в избранное:', response.data);
         } catch (error) {
            console.error('Ошибка при добавлении рецепта в избранное:', error.response.data.message);
         }
      } else {
         setShowModal(true);
      }

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
         alert('Рецепт успешно удален из избранного')
         dispatch(toggleFavorite({ userId, dishId: dish_id }));
         navigate('/favorite');
      } catch (error) {
         console.error('Ошибка при удалении рецепта из избранного:', error.response.data.message);
      }
   };

   const baseUrl = 'http://localhost:3000';

   if (!recipe) {
      return <div>Loading...</div>;
   }

   const handleCloseModal = () => {
      setShowModal(false);
   };

   return (
      <div className="recipe-details-container">
         <Navigation />
         <div className="recipe-details">
            <div className="recipe-info">
               <h2>{recipe.dish_title}</h2>
               <div className="main-image">
                  <img src={`${baseUrl}/${recipe.coverphoto}`} alt={recipe.dish_title} />
               </div>
            </div>
            {showModal && <LoginModal onClose={handleCloseModal} />}
            <div className="recipe-details-right">

               {
                  isAdmin ?
                     <button className="favorite-button-del" onClick={() => { handleDeleteDish(recipe.dish_id); }}>Удалить рецепт</button> :
                     isFavorite ?
                        <button className="favorite-button-del" onClick={(e) => { e.stopPropagation(); handleDeleteFavorite(recipe.dish_id); }}> Удалить из избранного</button> :
                        <button className="favorite-button" onClick={() => { handleAddFavorite(recipe.dish_id); }}>Добавить в избранное</button>
               }
               <div className="ingredient-list-recipe">
                  <h3>Ингредиенты:</h3>
                  <ul>
                     {recipe.ingredient_titles.map((ingredient, index) => (
                        <li key={index}>{ingredient}</li>
                     ))}
                  </ul>
               </div>
            </div>
         </div>
         <div className='recipe-decription'>
            <h3>Описание</h3>
            <div>
               {recipe.description}
            </div>
         </div>
         <div className="recipe-steps">
            <h3>Шаги:</h3>
            {recipe.step_descriptions.map((step, index) => (

               <div className="step" key={index}>
                  <div>Шаг {recipe.step_numbers[index]}:</div>
                  <div className="step-image">
                     <img src={`${baseUrl}/${recipe.file_path[index]}`} alt={`Шаг ${index + 1}`} />
                  </div>
                  <div className="step-description">
                     <p>{step}</p>
                  </div>
               </div>
            ))}
         </div>
      </div>
   );
};

export default RecipeDetails;
