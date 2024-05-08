import React, { useState, useEffect } from 'react';
import Search from "./Search";
import axios from 'axios';
import { setDishes } from '../redux/dishesSlice';
import { useDispatch, useSelector } from 'react-redux';
import Navigation from './Navigation';

const DataComponent = () => {
   const dispatch = useDispatch();
   const dishes = useSelector(state => state.dishes.dishes);
   const [search, setSearch] = useState("");
   const [searchResult, setSearchResult] = useState([]);
   const [selectedDish, setSelectedDish] = useState([]);
   const [isblock, setIsblock] = useState(false);
   const [resultSearching, setResultSearching] = useState("");
   const [isSearchActive, setIsSearchActive] = useState(true);


   const fetchData = async () => {
      try {
         const result = await axios.get('/api/dishes');
         dispatch(setDishes(result.data));
         setSearchResult(result.data);
      } catch (error) {
         console.error('Ошибка при получении блюд:', error);
      }
   };

   useEffect(() => {
      setSearchResult(dishes);
   }, [dishes]);
   
   useEffect(() => {
      fetchData();
   }, []);

   useEffect(() => {
      filter();
   }, [search]);

   const filter = () => {
      if (search.length > 0) {
         const filter = dishes.filter(dish => dish.dish_title.toLowerCase().includes(search.toLowerCase()));
         setSelectedDish(filter)
      }
   }

   const filterSearchDishes = () => {
      if (search.length > 0) {
         const filter = dishes.filter(dish => dish.dish_title.toLowerCase().includes(search.toLowerCase()));
         setSearchResult(filter)
      }
   }

   const handleAddSelectedSearch = (obj) => {
      setResultSearching(obj.dish_title)
      setIsblock(true)
      setSearchResult([obj]);
      setSelectedDish([]);
   }

   const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
         event.target.blur();
         setResultSearching(search)
         setIsblock(true)
         setIsSearchActive(false);
         filterSearchDishes();
      }
   };

   const handleReturnDishes = () => {
      setSearchResult(dishes);
      setIsblock(false)
   }

   const handleFocus = () => {
      setIsSearchActive(true);
   };

   const handleBlur = () => {
      const timerId = setTimeout(() => {
         setIsSearchActive(false);
      }, 100); 
      setTimeout(timerId);
   };

   const handleDeleteDish = async (dish_id) =>{
      try {
         const response = await axios.delete(`/api/dishes/${dish_id}`);
         fetchData();
         console.log('Рецепт успешно удален:', response.data);
      } catch (error) {
         console.error('Ошибка при удалении рецепта:', error);
      }
   }


   return (
      <div>
      <Navigation/>
         <div style={{ width: "600px" }}>
            <Search
               searchValue={search}
               setSearchValue={setSearch}
               onKeyPress={handleKeyPress}
               setIsblock={setIsblock}
               setSelectedDish={setSelectedDish}
               handleFocus={handleFocus}
               handleBlur={handleBlur}
            />
            <div style={{ display: isSearchActive ? 'flex' : "none", flexDirection: "column" }}>
               {selectedDish.map(item => (
                  <span onClick={() => handleAddSelectedSearch(item)} style={{ cursor: 'pointer', marginTop: '10px' }} key={item.id}  >{item.dish_title}</span>
               ))}
            </div>
         </div>
         <h1>Рецепты блюд:</h1>
         <button onClick={() => handleReturnDishes()}>Вернуться к рецептам</button>
         <p style={{ display: isblock ? 'block' : 'none' }}>Результаты поиска: {resultSearching}</p>
         <div>
            {searchResult.map((item) => (
               <div key={item.id}>{item.dish_title}
                  <ul>
                     {item.ingredient_titles.map(ingr => (
                        <li key={item.id}>{ingr}</li>
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
                  <button type="button" onClick={() => handleDeleteDish(item.dish_id)}>Удалить рецепт</button>
                  <br /><br />
               </div>
            ))}
         </div>
      </div>
   );
};

export default DataComponent;