import React, { useState, useEffect } from 'react';
import Search from "./Search";
import axios from 'axios';
import { setDishes } from '../redux/dishesSlice';
import { useDispatch, useSelector } from 'react-redux';
import Navigation from './Navigation';
import LoginModal from './LoginModal';
import { useNavigate } from 'react-router-dom';

const DataComponent = () => {
   const dispatch = useDispatch();
   const dishes = useSelector(state => state.dishes.dishes);
   const [search, setSearch] = useState("");
   const [searchResult, setSearchResult] = useState([]);
   const [selectedDish, setSelectedDish] = useState([]);
   const [isblock, setIsblock] = useState(false);
   const [resultSearching, setResultSearching] = useState("");
   const [isSearchActive, setIsSearchActive] = useState(true);
   const isAdmin = useSelector(state => state.auth.isAdmin);
   const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
   const [showModal, setShowModal] = useState();
   const navigate = useNavigate();
   const fetchData = async () => {
      try {
         const result = await axios.get('/api/dishes');
         dispatch(setDishes(result.data));
         //console.log(result.data)
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

   const handleDeleteDish = async (dish_id) => {
      try {
         const token = localStorage.getItem('token');
         const config = {
            headers: {
               'Authorization': `Bearer ${token}`
            }
         };
         const response = await axios.delete(`/api/dishes/${dish_id}`, config);
         fetchData();
         console.log('Рецепт успешно удален:', response.data);
      } catch (error) {
         console.error('Ошибка при удалении рецепта:', error.response.data.message);
      }
   };

   const handleAddFavorite = async (dish_id) => {
      if (isLoggedIn) {
         try {
            const token = localStorage.getItem('token');
            const config = {
               headers: {
                  'Authorization': `Bearer ${token}`
               }
            };
            const response = await axios.post('/api/addFavorite', { dish_id }, config);
            console.log('Рецепт успешно добавлен в избранное:', response.data);
         } catch (error) {
            console.error('Ошибка при добавлении рецепта в избранное:', error.response.data.message);
         }
      } else {
         setShowModal(true);
      }

   };

   const randomNum = () => {
      let num = Math.floor(Math.random() * 10000)
      //console.log(num)
      return num;
   }

   const handleCloseModal = () => {
      setTimeout(() => {
         setShowModal(false);
      }, 100);
   };

   return (
      <div>
         <Navigation />
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
                  <span onClick={() => handleAddSelectedSearch(item)} style={{ cursor: 'pointer', marginTop: '10px' }} key={randomNum()}  >{item.dish_title}</span>
               ))}
            </div>
         </div>
         <h1>Рецепты блюд:</h1>
         <button onClick={() => handleReturnDishes()}>Вернуться к рецептам</button>
         <p style={{ display: isblock ? 'block' : 'none' }}>Результаты поиска: {resultSearching}</p>
         <div>
            {searchResult.map((item) => (
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
                  {isAdmin && <button type="button" onClick={() => handleDeleteDish(item.dish_id)}>Удалить рецепт</button>}
                  {showModal && <LoginModal onClose={handleCloseModal} />}
                  {!isAdmin &&
                     <button type="button" onClick={() => handleAddFavorite(item.dish_id)}>Добавить в избранное
                     </button>}
                  <br /><br />
               </div>
            ))}
         </div>
      </div>
   );
};

export default DataComponent;