import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

const AddDishForm = () => {
   const [title, setTitle] = useState('');
   const [ingredient, setIngredient] = useState('');
   const [availableIngredients, setAvailableIngredients] = useState([]);
   const [selectedIngredients, setSelectedIngredients] = useState([]);

   useEffect(() => {
      // Загрузка доступных ингредиентов из базы данных
      const fetchIngredients = async () => {
         try {
            const response = await axios.get('/api/ingredients');
            setAvailableIngredients(response.data);
         } catch (error) {
            console.error('Ошибка при загрузке ингредиентов:', error);
         }
      };
      fetchIngredients();
   }, []);

   const handleDishInputChange = (e) => {
      setTitle(e.target.value);
   };

   const handleIngredientInputChange = (e) => {
      setIngredient(e.target.value);
   };

   const handleIngredientAdd = () => {
      const ingredientToAdd = availableIngredients.find(item => item.title === ingredient);
      if (ingredientToAdd) {
         setSelectedIngredients(prevIngredients => [...prevIngredients, ingredientToAdd]);
      }
};

//BIG ZATUP HERE

   const handleSubmit = async (e) => {
      e.preventDefault();
      try {
         // Отправка запроса на сервер для добавления блюда
         const response = await axios.post('/api/dish', { title });
         const { dish_id } = response.data; // получаем ID только что добавленного блюда
        // console.log(response.data);

         // Отправка запросов на сервер для добавления ингредиентов блюда в таблицу Dishes_Ingredients
         const ingredientPromises = selectedIngredients.map(ingredient => {
            return axios.post('/api/dishes-ingredients', { dish_id, ingredientId: ingredient.id });
         });

         // Ждем завершения всех запросов
         await Promise.all(ingredientPromises);

         alert('Блюдо успешно добавлено!');
      } catch (error) {
         console.error('Ошибка при добавлении блюда:', error);
         alert('Ошибка при добавлении блюда!');
      }
   };

   return (
      <div>
         <h2>Добавить блюдо</h2>
         <form onSubmit={handleSubmit}>
            <label>
               Название блюда:
               <input type="text" value={title} onChange={handleDishInputChange} />
            </label>
            <br />
            <label>
               Название ингредиента:
               <Autocomplete
                  options={availableIngredients}
                  getOptionLabel={(option) => option.title}

                  onChange={handleIngredientInputChange}
                  renderInput={(params) => <TextField {...params} label="Ингредиент" />}
               />
            </label>
            <button type="button" onClick={handleIngredientAdd}>Добавить ингредиент</button>
            <br />
            <ul>
               {selectedIngredients.map(ingredient => (
                  <li key={ingredient.id}>{ingredient.name}</li>
               ))}
            </ul>
            <button type="submit">Добавить блюдо</button>
         </form>
      </div>
   );
};

export default AddDishForm;
