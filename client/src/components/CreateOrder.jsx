import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CookingStep from "./CookingStep";
import Navigation from './Navigation';


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

   const handleChangeTextarea = (e) => {
      setDescription(e.target.value)
   };

   const formData = new FormData();

   const handleFileChange = (event) => {
      setLastSelectedFile(event.target.files[0]);
   };

   const handleAddStep = () => {
      if (lastSelectedFile) {
         const newStep = {
            step_number: stepNumber,
            step_description: stepDescription,
            tempPhoto: URL.createObjectURL(lastSelectedFile), // Создание URL для отображения изображения
         };
         setSteps([...steps, newStep]);
         setStepNumber(stepNumber + 1);
         setStepDescription('');

         setSelectedFiles([...selectedFiles, lastSelectedFile]); // Добавление последнего выбранного файла к общему списку файлов
         setLastSelectedFile(null); // Сброс последнего выбранного файла
      } else {
         console.log('Error! File was not selected');
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
         const coverPhotoFile = uploadedFilePath.filter(filePath => filePath.includes('coverPhoto')).join(''); // Объединяем массив в строку
         console.log('coverPhotoFile:', coverPhotoFile);
         const token = localStorage.getItem('token');
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
      <div>
         <Navigation />
         <h2>Добавить блюдо</h2>
         <form onSubmit={handleSubmit}>
            <label>
               Фотография для обложки:
               <input
                  type="file"
                  accept="image/*,.png,.img,.gif,.web,"
                  onChange={handleCoverPhotoChange}
               />
            </label>
            <br />
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
               <CookingStep stepNumber={stepNumber} stepDescription={stepDescription} setStepDescription={setStepDescription} />
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