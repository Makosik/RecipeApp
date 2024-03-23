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


   const handleIngredientAdd = () => {
      // Проверяем наличие выбранного ингредиента в списке selectedIngredients
      const isIngredientSelected = selectedIngredients.some(selectedIngredient => selectedIngredient.title === ingredient.title);

      if (!isIngredientSelected) {
         // Если ингредиент еще не выбран, добавляем его в список selectedIngredients
         setSelectedIngredients(prevIngredients => [...prevIngredients, ingredient]);
         console.log(`Ингредиент добавлен: ${ingredient.title}`);
         console.log(`Все выбранные Ингредиенты:`);
         selectedIngredients.forEach(ingredient => {
            console.log(ingredient);
         });
      } else {
         // Если ингредиент уже выбран, выводим сообщение об ошибке
         console.log(`Ингредиент "${ingredient.title}" уже добавлен`);
      }
   };



   const handleSubmit = async (e) => {
      e.preventDefault();
      try {
         console.log(selectedIngredients.map(ingredient => ingredient.id))
         // Сначала отправляем запрос на сервер для добавления блюда и его ингредиентов в таблицу Orders
         await axios.post('/api/createDish', { dish_title: title, ingredient_id: selectedIngredients.map(ingredient => ingredient.id) });
         alert('Блюдо успешно добавлено в заявку!');
         setSelectedIngredients([]);
         setTitle([]);
      } catch (error) {
         console.error('Ошибка при добавлении блюда:', error);
         alert('Ошибка при добавлении блюда в заявку!');
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
                  value={null}
                  onChange={(event, newValue) => {
                     console.log(newValue);
                     setIngredient(newValue);
                  }}
                  renderInput={(params) => <TextField {...params} label="Ингредиент" />}
               />
            </label>
            <button type="button" onClick={handleIngredientAdd}>Добавить ингредиент</button>
            <br />
            <ul>
               {selectedIngredients.map(ingredient => (
                  <li key={ingredient.id}>{ingredient.title}</li>
               ))}
            </ul>
            <button type="submit">Добавить блюдо</button>
         </form>
      </div>
   );
};

export default AddDishForm;
