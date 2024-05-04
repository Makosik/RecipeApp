import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setOrders } from '../redux/ordersSlice';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CookingStep from "./CookingStep";


function AddDishForm() {
   const [title, setTitle] = useState('');
   const [ingredient, setIngredient] = useState('');
   const [availableIngredients, setAvailableIngredients] = useState([]);
   const [selectedIngredients, setSelectedIngredients] = useState([]);
   const [description, setDescription] = useState('');
   const [steps, setSteps] = useState([]);
   const [stepNumber, setStepNumber] = useState(1);
   const [stepDescription, setStepDescription] = useState('');
   const dispatch = useDispatch();
   const [uploadedFile, setUploadedFile] = useState(null);
   const [selectedFile, setSelectedFile] = useState(null); // for upload


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
      const isIngredientSelected = selectedIngredients.some(selectedIngredient => selectedIngredient.title === ingredient.title);
      if (!ingredient) {
         alert("Нужно написать ингредиент, который вы хотите добавить!")
         return;
      }
      if (!isIngredientSelected) {
         setSelectedIngredients(prevIngredients => [...prevIngredients, ingredient]);
         console.log(`Ингредиент добавлен: ${ingredient.title}`);
         console.log(`Все выбранные Ингредиенты:`);
         selectedIngredients.forEach(ingredient => {
            console.log(ingredient);
         });
      } else {
         console.log(`Ингредиент "${ingredient.title}" уже добавлен`);
      }
   };

   const handleIngredientDelete = (title) => {
      setSelectedIngredients(prevIngredients => prevIngredients.filter(ingredient => ingredient.title !== title));
   };

   const handleChangeTextarea = (e) => {
      setDescription(e.target.value)
   };

   const formData = new FormData();

   const handleAddStep = () => {
      if (selectedFile) {
         const imageURL = URL.createObjectURL(selectedFile);
         const newStep = {
           step_number: stepNumber,
           step_description: stepDescription,
           tempPhoto: imageURL,
         };
      setSteps([...steps, newStep]);
      setStepNumber(stepNumber + 1);
      setStepDescription('');
      setUploadedFile(null);
      // setSelectedFile(null);
      //handleUpload();
      console.log(steps)
      console.log(selectedFile)
      //console.log(imageURL)
      }
   };
  
   const handleUpload = async () => {
      if (selectedFile) {
         formData.append('photo', selectedFile);
         setSelectedFile(null);
      } else {
         alert('Выберите файл для загрузки');
      }
      try {
         const response = await axios.post('/api/upload', formData);
         if (response.status === 200) {
            const filePath = response.data.filePath;
            console.log('Фотография успешно загружена:', filePath);
            setUploadedFile(filePath);
         } else {
            console.error('Ошибка при загрузке фотографии:', response.statusText);
         }
      } catch (error) {
         console.error('Ошибка при отправке запроса на загрузку фотографии:', error);
      }
   };

   const handleFileChange = (event) => {
      setSelectedFile(event.target.files[0]); // для загрузки
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      await handleUpload();
      try {
         if (selectedIngredients.length > 0 && title.length > 0) {
            
            await axios.post('/api/createDish', { dish_title: title, ingredient_id: selectedIngredients.map(ingredient => ingredient.id), description: description, cookingSteps: steps });
            const updatedOrders = await axios.get('/api/orders'); // Обновленный список заказов
            dispatch(setOrders(updatedOrders.data)); // Обновление данных о заказах в Redux
            setSelectedIngredients([]);
            setDescription('');
            setTitle('');
            setSteps([]);
            setStepNumber(1)
            alert('Блюдо успешно добавлено в заявку!');
         } else {
            alert('Нельзя добавить блюдо без ингредиентов или без названия!');
         }
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
                  sx={{ width: 300 }}
                  onChange={(event, newValue) => {
                     setIngredient(newValue);
                  }}
                  renderInput={(params) => <TextField {...params} label="Ингредиент" />}
               />
            </label>
            <button type="button" onClick={handleIngredientAdd}>Добавить ингредиент</button>
            <ul>
               {selectedIngredients.map(ingredient => (
                  <li key={ingredient.id}>
                     {ingredient.title} <button type='button' onClick={() => handleIngredientDelete(ingredient.title)}>X</button>
                  </li>
               ))}
            </ul>
            <label>
               <textarea name="description" onChange={handleChangeTextarea} value={description} placeholder='Добавьте описание' id="" cols="30" rows="10"></textarea>
            </label>
            <br />
            <label>
               <input
                  type="file"
                  accept='image/*,.png,.img,.gif,.web,'
                  onChange={handleFileChange} />
               <br />
               <CookingStep stepNumber={stepNumber} stepDescription={stepDescription} setStepDescription={setStepDescription}  />
               <div>
                  {steps.map((step, index) => (
                     <li key={index}>
                        {`Шаг ${step.step_number}:`}
                        <br />
                        {step.tempPhoto && <img src={step.tempPhoto} alt={`Выбранное изображение`} width={300} height={200} />}
                        <div style={{ width: "300px", overflowWrap: "break-word" }}>{step.step_description}</div>
                     </li>
                  ))}
               </div>
               <button type='button' onClick={handleAddStep}>Добавить шаг</button>
            </label>
            <button style={{ display: "block", marginTop: "50px" }} type="submit">Добавить блюдо</button>
         </form>
      </div>
   );
}

export default AddDishForm;