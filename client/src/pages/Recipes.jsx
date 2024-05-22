import React, { useState, useEffect } from 'react';
import Search from "../components/Search";
import axios from 'axios';
import { setDishes } from '.././redux/dishesSlice';
import { toggleFavorite } from '.././redux/favoriteSlice';
import { useDispatch, useSelector } from 'react-redux';
import Navigation from '../components/Navigation';
import LoginModal from '../components/LoginModal';
import { useNavigate } from 'react-router-dom';
import '../style/styles.css';
import LoadingIndicator from '../components/LoadingIndicator';

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
   const [blockForBtn, setblockForBtn] = useState(false);
   const userId = useSelector(state => state.auth.userId);

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
      setblockForBtn(true)
      setSearchResult([obj]);
      setSelectedDish([]);
      setSearch('')
   }

   const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
         event.target.blur();
         setResultSearching(search)
         setIsblock(true)
         setblockForBtn(true)
         setIsSearchActive(false);
         filterSearchDishes();
      }
   };

   const handleClickSearch = () => {
      setResultSearching(search)
      setIsblock(true)
      setblockForBtn(true)
      setIsSearchActive(false);
      filterSearchDishes();
   }

   const handleReturnDishes = () => {
      setSearchResult(dishes);
      setIsblock(false)
      setblockForBtn(false)
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
            dispatch(toggleFavorite({ userId, dishId: dish_id }));
            console.log('Рецепт успешно добавлен в избранное:', response.data);
            alert('Рецепт успешно добавлен в избранное')
         } catch (error) {
            console.error('Ошибка при добавлении рецепта в избранное:', error.response.data.message);
            alert('Рецепт уже находится в избранном')
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
      <div className='background-container '>
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
               <div className='icon-background' onClick={() => handleClickSearch()}></div>
               <p className="search-results" style={{ display: isblock ? 'block' : 'none' }}>Результаты поиска: {resultSearching}</p>
               <div className="suggestions-container" style={{ display: isSearchActive ? 'block' : "none" }}>
                  {selectedDish.map(item => (
                     <div className="suggestion-item" onClick={() => handleAddSelectedSearch(item)} key={item.dish_id}>
                        {item.dish_title}
                     </div>
                  ))}
               </div>
            </div>
            {blockForBtn && <button className="return-button" onClick={() => handleReturnDishes()}>Вернуться к рецептам</button>}
            <div className="recipe-cards">
               {searchResult.map(item => (
                  <div className="recipe-card" key={item.dish_id} onClick={() => handleCardClick(item.dish_id)}>
                     <img src={baseUrl + '/' + item.coverphoto} alt={item.dish_title} width={300} height={200} />
                     <h3>{item.dish_title}</h3>
                     <p className='recipe-card-desc'>{item.description}</p>
                     <div className="card-buttons">

                        {!isAdmin
                           &&
                           <button className="favorite-button" onClick={(e) => { e.stopPropagation(); handleAddFavorite(item.dish_id); }}>Добавить в избранное</button>}

                        {isAdmin && <button className='card-buttons-del' onClick={(e) => { e.stopPropagation(); handleDeleteDish(item.dish_id); }}>Удалить рецепт</button>}

                     </div>
                  </div>
               ))}
            </div>
            {showModal && <LoginModal onClose={handleCloseModal} />}
         </div>
      </div>
   );
};

export default DataComponent;
