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


const DataComponent = () => {
   const dispatch = useDispatch();
   const dishes = useSelector(state => state.dishes.dishes);
   const [search, setSearch] = useState("");
   const [searchResult, setSearchResult] = useState([]);
   const navigate = useNavigate();
   const userId = useSelector(state => state.auth.userId);

   const [showModal, setShowModal] = useState(false);
   const [selectedDish, setSelectedDish] = useState([]);
   const [resultSearching, setResultSearching] = useState("");

   const isAdmin = useSelector(state => state.auth.isAdmin);
   const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

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
                  setSearchResult={setSearchResult}
                  resultSearching={resultSearching}
                  setResultSearching={setResultSearching}
                  selectedDish={selectedDish}
                  setSelectedDish={setSelectedDish}
                  dishes={dishes}
               />
            </div>
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
