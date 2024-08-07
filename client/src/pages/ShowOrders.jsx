import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setOrders } from '.././redux/ordersSlice';
import { setDishes } from '.././redux/dishesSlice';
import Navigation from '../components/Navigation';
import { useNavigate } from 'react-router-dom';
import '../style/CreateOrder.css';
import {
   getAccessToken,
   isTokenExpired,
   refreshAccessToken
 } from '../utils/authUtils';

function ShowOrders() {
   const dispatch = useDispatch();
   const userId = useSelector(state => state.auth.userId)
   const orders = useSelector(state => state.orders.orders);
   const navigate = useNavigate();
   const [accessToken, setAccessTokenState] = useState(getAccessToken());


   useEffect(() => {
      const fetchData = async () => {
        if (accessToken && isTokenExpired(accessToken)) {
          const newAccessToken = await refreshAccessToken();
          setAccessTokenState(newAccessToken);
        }
        fetchDataOrders(accessToken || getAccessToken());
      };
      fetchData();
    }, [accessToken]);

   const fetchDataOrders = async (currentToken) => {
      try {
         const config = {
            headers: {
               'Authorization': `Bearer ${currentToken}`
            }
         };
         const result = await axios.get('/api/orders', config);
         dispatch(setOrders(result.data));
         const updateDishes = await axios.get('/api/dishes');
         dispatch(setDishes(updateDishes.data));
      } catch (error) {
         console.error('Ошибка при получении заказов:', error.response.data.message);
      }
   };

   const handleDeleteOrder = async (order_id) => {
      try {
         const token = getAccessToken();
         const config = {
            headers: {
               'Authorization': `Bearer ${token}`
            }
         };
         const response = await axios.delete(`/api/orders/${order_id}`, config);
         fetchDataOrders();
         alert('Заявка успешно удалена!');
         console.log('Заявка успешно удалена:', response.data);
      } catch (error) {
         console.error('Ошибка при удалении заявки:', error);
      }
   };

   const handleAddOrder = async (dish_title, order_id, ingredient_id,) => {
      try {
         const token = getAccessToken();

         const config = {
            headers: {
               'Authorization': `Bearer ${token}`
            }
         };
         console.log(ingredient_id)
         const response = await axios.post(`/api/addOrder`, {
            "dish_title": dish_title,
            "ingredient_id": ingredient_id,
            "order_id": order_id,
            "user_id": userId
         }, config);

         await handleDeleteOrder(order_id);
         fetchDataOrders();
         console.log('Заявка успешно добавлена:', response.data);
         alert('Заявка успешно добавлена!');
      } catch (error) {
         console.error('Ошибка при добавлении заявки:', error)
         alert('Ошибка при добавлении заявки!');
      }
   };

   const handleRowClick = (orderId) => {
      navigate(`/order/${orderId}`);
   };


   return (
      <div className='add-dish-container'>
         <Navigation />
         <br /><br />
         <h1>Заявки:</h1>

         <table>
            <thead>
               <tr>
                  <th>ID заявки</th>
                  <th>ID пользователя</th>
                  <th>Дата</th>
                  <th>Название блюда</th>
                  <th>Удалить</th>
                  <th>Добавить</th>
               </tr>
            </thead>
            <tbody>
               {orders.map(order => (
                  <tr key={order.order_id} onClick={() => handleRowClick(order.order_id)} style={{ cursor: 'pointer' }}>
                     <td>{order.order_id}</td>
                     <td>{order.user_id}</td>
                     <td>{order.created_at}</td>
                     <td>{order.dish_title}</td>
                     <td><button className='card-buttons-del' onClick={(e) => { e.stopPropagation(); handleDeleteOrder(order.order_id); }}>Удалить заявку</button></td>
                     <td><button className='card-button' onClick={(e) => { e.stopPropagation(); handleAddOrder(order.dish_title, order.order_id, order.ingredient_id); }}>Добавить заявку</button></td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   );
}

export default ShowOrders;