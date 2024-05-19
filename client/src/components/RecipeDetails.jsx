import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Navigation from './Navigation';
import { useSelector } from 'react-redux';
import '../style/RecipeDetails.css';
import LoginModal from './LoginModal';

const RecipeDetails = () => {
   const isAdmin = useSelector(state => state.auth.isAdmin);
   const { id } = useParams();
   const [recipe, setRecipe] = useState(null);
   const navigate = useNavigate();
   const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
   const [showModal, setShowModal] = useState();

   useEffect(() => {
      fetchRecipeDetails();
   }, [id]);

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
         //console.log(recipeData)
      } catch (error) {
         console.error('Ошибка при загрузке деталей рецепта:', error);
      }
   };

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
            navigate('/favorite');
            console.log('Рецепт успешно добавлен в избранное:', response.data);
         } catch (error) {
            console.error('Ошибка при добавлении рецепта в избранное:', error.response.data.message);
         }
      } else {
         setShowModal(true);
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
            {!isAdmin && <button  className="favorite-button" style={{marginLeft: '100px'}}  onClick={() => { handleAddFavorite(recipe.dish_id);  }}>Добавить Избранное</button>}
            {isAdmin && <button className="favorite-button" style={{marginLeft: '100px'}}  onClick={() => { handleDeleteDish(recipe.dish_id); }}>Удалить рецепт</button>}
               <div className="ingredient-list">
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
