import React, { useState, useEffect } from 'react';
import Search from "./Search";
import axios from 'axios';
import { setDishes } from '../redux/dishesSlice';
import { useDispatch, useSelector } from 'react-redux';
import Navigation from './Navigation';
import LoginModal from './LoginModal';
import { Link, useNavigate } from 'react-router-dom';
import '../style/styles.css';

const DataComponent = () => {
   const dispatch = useDispatch();
   const dishes = useSelector(state => state.dishes.dishes);
   const [search, setSearch] = useState("");
   const [searchResult, setSearchResult] = useState([]);
   const [selectedDish, setSelectedDish] = useState([]);
   const [isblock, setIsblock] = useState(false);
   const [resultSearching, setResultSearching] = useState("");
   const [isSearchActive, setIsSearchActive] = useState(false);
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
      setSearch('')
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

   const handleCloseModal = () => {
      setShowModal(false);
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

   const handleCardClick = (dish_id) => {
      navigate(`/dishes/${dish_id}`);
   };

   const baseUrl = 'http://localhost:3000';

   return (
      <div className='wrapper'>
         <Navigation />
         <div className="search-section">
            <Search
               searchValue={search}
               setSearchValue={setSearch}
               onKeyPress={handleKeyPress}
               setIsblock={setIsblock}
               setSelectedDish={setSelectedDish}
               handleFocus={handleFocus}
               handleBlur={handleBlur}
            />
            <div className="suggestions-container" style={{ display: isSearchActive ? 'block' : "none" }}>
               {selectedDish.map(item => (
                  <div className="suggestion-item" onClick={() => handleAddSelectedSearch(item)} key={item.dish_id}>
                     {item.dish_title}
                  </div>
               ))}
            </div>
         </div>

         <h1>Рецепты блюд:</h1>
         <button className="return-button" onClick={() => handleReturnDishes()}>Вернуться к рецептам</button>
         <p className="search-results" style={{ display: isblock ? 'block' : 'none' }}>Результаты поиска: {resultSearching}</p>
         <div className="recipe-cards">
            {searchResult.map(item => (
               <div className="recipe-card" key={item.dish_id} onClick={() => handleCardClick(item.dish_id)}>
                  <img src={baseUrl + '/' + item.coverphoto} alt={item.dish_title} width={300} height={200} />
                  <h3>{item.dish_title}</h3>
                  <p>{item.description}</p>
                  <div className="card-buttons">
                  {isAdmin && <button onClick={(e) => { e.stopPropagation(); handleDeleteDish(item.dish_id); }}>Удалить</button>}
                  {!isAdmin && <button onClick={(e) => { e.stopPropagation(); handleAddFavorite(item.dish_id); navigate('/favorite'); }}>Избранное</button>}
                  </div>
               </div>
            ))}
         </div>
         {showModal && <LoginModal onClose={handleCloseModal} />}
      </div>
   );
};

export default DataComponent;
