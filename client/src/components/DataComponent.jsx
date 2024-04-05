import React, { useState, useEffect } from 'react';
import Search from "./Search";
import axios from 'axios';
import { setDishes } from '../redux/dishesSlice';
import { useDispatch, useSelector } from 'react-redux';

const DataComponent = () => {
   const dispatch = useDispatch();
   const dishes = useSelector(state => state.dishes.dishes);
   const [search, setSearch] = useState("");
   const [searchResult, setSearchResult] = useState([]);
   const [selectedDish, setSelectedDish] = useState([]);
   const [isblock, setIsblock] = useState(false);
   const [resultSearching, setResultSearching] = useState("");
   const [isSearchActive, setIsSearchActive] = useState(true); // Новое состояние для отслеживания активности поиска

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
      // Добавляем небольшую задержку перед установкой isSearchActive в false
      const timerId = setTimeout(() => {
         setIsSearchActive(false);
      }, 100); // Измените значение задержки по вашему усмотрению (в миллисекундах)
      setTimeout(timerId);
   };


   return (
      <div>
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
            {searchResult.map(item => (
               <div key={item.id}>{item.dish_title}
                  <ul>
                     {item.ingredient_titles.map(ingr => (
                        <li key={item.id}>{ingr}</li>
                     ))}
                  </ul>
                  <div>Описание: {item.description}</div>
               </div>
            ))}
         </div>
      </div>
   );
};

export default DataComponent;