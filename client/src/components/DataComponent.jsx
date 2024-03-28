import React, { useState, useEffect } from 'react';
import Search from "./Search";
import axios from 'axios';
import { setDishes } from '../dishesSlice';
import { useDispatch, useSelector } from 'react-redux';

const DataComponent = () => {
   const [search, setsearch] = useState("");

   const dispatch = useDispatch();
   const dishes = useSelector(state => state.dishes.dishes)

   const fetchData = async () => {
      try {
         const result = await axios.get('/api/dishes');
         dispatch(setDishes(result.data));
      } catch (error) {
         console.error('Ошибка при получении блюд:', error);
      }
   };
   useEffect(() => {
      fetchData();
   }, []);

   return (
      <div>
         <Search searchValue={setsearch} />
         <h1>Рецепты блюд:</h1>
         <div>
            {dishes.map(item => (
               <div key={item.id}>{item.dish_title}
                  <ul>
                     {item.ingredient_titles.map(ingr => (
                        <li>{ingr}</li>
                     ))}
                  </ul>
               </div>
            ))}
         </div>
      </div>
   );
};

export default DataComponent;