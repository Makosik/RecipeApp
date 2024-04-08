import React, { useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setOrders } from '../redux/ordersSlice';
import { setDishes } from '../redux/dishesSlice';

function ShowOrders() {
   const dispatch = useDispatch();
   const orders = useSelector(state => state.orders.orders);

   useEffect(() => {
      fetchData();
   }, []);

   const fetchData = async () => {
      try {
         const result = await axios.get('/api/orders');
         dispatch(setOrders(result.data));
         const updateDishes = await axios.get('/api/dishes');
         dispatch(setDishes(updateDishes.data));
         //console.log(`Its SHOW ${result.data}`)
      } catch (error) {
         console.error('Ошибка при получении заказов:', error);
      }
   };

   const handleDeleteOrder = async (order_id) => {
      try {
         console.log(order_id)
         // Отправляем запрос на сервер для удаления заявки
         const response = await axios.delete(`/api/orders/${order_id}`);
         fetchData();
         console.log('Заявка успешно удалена:', response.data);
      } catch (error) {
         console.error('Ошибка при удалении заявки:', error);
      }
   };

   const handleAddOrder = async (dish_title, order_id, ingredient_id, description, step_numbers, step_descriptions) => {
      try {
         const response = await axios.post(`/api/addOrder`, {
            "dish_title": dish_title,
            "ingredient_id": ingredient_id,
            "description": description,
            "step_numbers": step_numbers,
            "step_descriptions": step_descriptions
         });
         await handleDeleteOrder(order_id);
         fetchData();
         console.log('Заявка успешно добавлена:', response.data);
         alert('Заявка успешно добавлена!');
      } catch (error) {
         console.error('Ошибка при добавлении заявки:', error)
         alert('Заявка успешно добавлена!');
      }
   };


   return (
      <div>
         <h1>Заявки:</h1>
         <div>
            {orders.map(order => (
               <div key={order.order_id}>
                  <div>Заявка номер: {order.order_id}</div>
                  <div>Дата заявки: {order.created_at}</div>
                  <div>Название блюда: {order.dish_title}</div>
                  <ul>
                     {order.ingredients.map(ingredient => (
                        <li key={ingredient}>{ingredient}</li>
                     ))}
                  </ul>
                  <div>Описание: {order.description}</div>
                  <div>
                  {order.step_numbers.map((stepNumber, index) => (
                     <li key={index}>
                        {`Шаг ${stepNumber}:`}
                        <div style={{ width: "300px", overflowWrap: "break-word" }}>{order.step_descriptions[index]}</div>
                     </li>
                  ))}
                  </div>
                  <button type="button" onClick={() => handleDeleteOrder(order.order_id)}>Удалить заявку</button>
                  <button type="button" onClick={() => handleAddOrder(order.dish_title, order.order_id, order.ingredient_id, order.description, order.step_numbers, order.step_descriptions)}>Добавить заявку</button>
               </div>
            ))}
         </div>
      </div>
   );
}

export default ShowOrders;