import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CookingStep from "../components/CookingStep";
import Navigation from '../components/Navigation';
import '../style/CreateOrder.css';
import {
   getAccessToken
 } from '../utils/authUtils';

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
   const userId = useSelector(state => state.auth.userId)
   const [selectedFiles, setSelectedFiles] = useState([]); // for upload
   const [lastSelectedFile, setLastSelectedFile] = useState(null);
   const navigate = useNavigate();
   const [coverPhoto, setCoverPhoto] = useState(null);

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

   const handleStepDelete = (stepId) => {
      const filteredSteps = steps.filter(step => step.step_number !== stepId + 1);
      const updatedSteps = filteredSteps.map((step, index) => ({
         ...step,
         step_number: index + 1
      }));
      setSteps(updatedSteps);
      setStepNumber(updatedSteps.length + 1);
   }

   const handleChangeTextarea = (e) => {
      setDescription(e.target.value)
   };

   const handleFileChange = (event) => {
      setLastSelectedFile(event.target.files[0]);
   };

   const handleAddStep = () => {
      if (lastSelectedFile) {
         const newStep = {
            step_number: stepNumber,
            step_description: stepDescription,
            tempPhoto: URL.createObjectURL(lastSelectedFile),
         };
         setSteps([...steps, newStep]);
         setStepNumber(stepNumber + 1);
         setStepDescription('');

         setSelectedFiles([...selectedFiles, lastSelectedFile]); 
         setLastSelectedFile(null); 
      } else {
         alert('Нельзя добавить шаг без выбранной фотографии');
      }
   };

   const handleUpload = async () => {
      const formData = new FormData();

      if (!selectedFiles.length && !coverPhoto) {
         alert('Выберите файл для загрузки');
         return;
      }

      if (selectedFiles.length) {
         selectedFiles.forEach(file => {
            formData.append('photo', file);
         });
      }

      if (coverPhoto) {
         formData.append('coverPhoto', coverPhoto);
      }

      try {
         const response = await axios.post('/api/upload', formData);
         if (response.status === 200) {
            const filePaths = response.data.filePath;
            console.log('Фотографии успешно загружены:', filePaths);
            return filePaths;
         } else {
            console.error('Ошибка при загрузке фотографии:', response.statusText);
         }
      } catch (error) {
         console.error('Ошибка при отправке запроса на загрузку фотографии:', error);
      }
   };


   const handleSubmit = async (e) => {
      e.preventDefault();
      try {
         if (selectedIngredients.length > 0 && title.length > 0) {
            const uploadedFilePath = await handleUpload();
            console.log('uploadedFilesPaths:', uploadedFilePath);
            const coverPhotoFile = uploadedFilePath.filter(filePath => filePath.includes('coverPhoto')).join(''); 
            console.log('coverPhotoFile:', coverPhotoFile);
            const token = getAccessToken();
            const config = {
               headers: {
                  'Authorization': `Bearer ${token}`
               }
            };
            await axios.post('/api/createDish', {
               dish_title: title,
               ingredient_id: selectedIngredients.map(ingredient => ingredient.id),
               description: description,
               cookingSteps: steps,
               uploadedFilesPaths: uploadedFilePath,
               coverPhotoFile: coverPhotoFile,
               userId: userId
            }, config);
            setSelectedIngredients([]);
            setDescription('');
            setTitle('');
            setSteps([]);
            setStepNumber(1);
            setSelectedFiles([]);
            alert('Блюдо успешно добавлено в заявку!');
            navigate('/');
         } else {
            alert('Нельзя добавить блюдо без ингредиентов или без названия!');
         }
      } catch (error) {
         console.error('Ошибка при добавлении блюда:', error.response.data.message);
         alert('Ошибка при добавлении блюда в заявку!');
      }
   };


   const handleCoverPhotoChange = (event) => {
      setCoverPhoto(event.target.files[0]);
   };


   return (
      <div className='background-container'>
         <div className="add-dish-container">

            <Navigation />
            <h1 className="title">Добавить блюдо</h1>
            <form className="form" onSubmit={handleSubmit}>
               <div className="form-group">
                  <label>Фотография для обложки:</label>
                  <input
                     type="file"
                     accept="image/*,.png,.img,.gif,.web,"
                     onChange={handleCoverPhotoChange}
                  />
               </div>
               <div className="form-group">
                  <label>Название блюда:</label>
                  <input type="text" value={title} onChange={handleDishInputChange} />
               </div>
               <div className="form-group">
                  <label>Название ингредиента:</label>
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
                  <button type="button" onClick={handleIngredientAdd} className="add-button">Добавить ингредиент</button>
                  <ul className="ingredient-list">
                     {selectedIngredients.map(ingredient => (
                        <li key={ingredient.id}>
                           {ingredient.title} <button type='button' onClick={() => handleIngredientDelete(ingredient.title)} className="delete-button"></button>
                        </li>
                     ))}
                  </ul>
               </div>
               <div className="form-group">
                  <label>Описание:</label>
                  <textarea name="description" onChange={handleChangeTextarea} value={description} placeholder='Добавьте описание' cols="30" rows="10"></textarea>
               </div>
               <div className="form-group">
                  <label>Шаги приготовления:</label>
                  <input
                     type="file"
                     accept='image/*,.png,.img,.gif,.web,'
                     onChange={handleFileChange}
                  />
                  <button type='button' onClick={handleAddStep} className="add-button">Добавить шаг</button>
                  <CookingStep stepNumber={stepNumber} stepDescription={stepDescription} setStepDescription={setStepDescription} />
                  <div className="steps">
                     {steps.map((step, index) => (
                        <li key={index} className="step">
                           {`Шаг ${step.step_number}:`}
                           <br />
                           {step.tempPhoto && <img src={step.tempPhoto} alt={`Выбранное изображение`} width={300} height={200} />}
                           <div className="step-description">{step.step_description}</div>
                           <button type='button' onClick={() => handleStepDelete(index)} className="delete-button"></button>
                        </li>
                     ))}
                  </div>
               </div>
               <button style={{ display: "block", marginTop: "50px" }} type="submit" className="submit-button">Добавить блюдо</button>
            </form>
         </div>
      </div>
   );
}

export default AddDishForm;