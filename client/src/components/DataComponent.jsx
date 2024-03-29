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
      filterSearch();
   }, [search]);


   const filterSearch = () => {
      const filter = dishes.filter(dish => dish.dish_title.toLowerCase().includes(search.toLowerCase()));
      setSelectedDish(filter)
   }
   const handleAddSelectedSearch = (title) => {
      setSearch(title.dish_title)
      setSearchResult([title]);
      setSelectedDish([]);
   }

   return (
      <div>
         <Search searchValue={search} setSearchValue={setSearch} />
         <div>
            {selectedDish.map(item => (
               <p onClick={() => handleAddSelectedSearch(item)} key={item.id}>{item.dish_title}</p>
            ))}
         </div>
         <h1>Рецепты блюд:</h1>
         <div>
            {searchResult.map(item => (
               <div >{item.dish_title}
                  <ul>
                     {item.ingredient_titles.map(ingr => (
                        <li key={item.id}>{ingr}</li>
                     ))}
                  </ul>
               </div>
            ))}
         </div>
      </div>
   );
};

export default DataComponent;