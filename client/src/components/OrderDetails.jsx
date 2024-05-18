import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navigation from './Navigation';

function OrderDetails() {
   const { orderId } = useParams();
   const [orderDetails, setOrderDetails] = useState(null);
   const navigate = useNavigate();

   useEffect(() => {
      fetchOrderDetails();
   }, [orderId]);

   const fetchOrderDetails = async () => {
      try {
         const token = localStorage.getItem('token');
         const config = {
            headers: {
               'Authorization': `Bearer ${token}`
            }
         };
         const response = await axios.get(`/api/order/${orderId}`, config);
         setOrderDetails(response.data);
         console.log(response.data)
      } catch (error) {
         console.error('Ошибка при загрузке деталей заказа:', error);
      }
   };
   if (!orderDetails) {
      return <div>Loading...</div>;
   }

   const handleDeleteOrder = async () => {
      try {
         const token = localStorage.getItem('token');
         const config = {
            headers: {
               'Authorization': `Bearer ${token}`
            }
         };
         const response = await axios.delete(`/api/orders/${order_id}`, config);
         console.log('Заявка успешно удалена:', response.data);
         navigate('/show-orders');
      } catch (error) {
         console.error('Ошибка при удалении заявки:', error);
      }
   };

   const handleAddOrder = async () => {
      try {
         const token = localStorage.getItem('token');

         const config = {
            headers: {
               'Authorization': `Bearer ${token}`
            }
         };
         console.log(ingredients)
         const response = await axios.post(`/api/addOrder`, {
            "dish_title": dish_title,
            "ingredient_id": ingredient_id,
            "order_id": order_id,
            "user_id": user_id
         }, config);

         await handleDeleteOrder(order_id);
         fetchOrderDetails();
         console.log('Заявка успешно добавлена:', response.data);
         alert('Заявка успешно добавлена!');
      } catch (error) {
         console.error('Ошибка при добавлении заявки:', error)
         alert('Заявка успешно добавлена!');
      }
   };

   const { order_id, user_id, created_at, dish_title, ingredients,ingredient_id, order_description, step_numbers, step_descriptions, file_path } = orderDetails;
   const baseUrl = 'http://localhost:3000';
   return (
      <div>
         <Navigation />
         <h2>Детали заказа #{order_id}</h2>
         <div>
            <div>Заявка номер: {order_id}</div>
            <div>user_id: {user_id}</div>
            <div>Дата заявки: {created_at}</div>
            <div>Название блюда: {dish_title}</div>
            <ul>
               {ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
               ))}
            </ul>
            <div>Описание: {order_description}</div>
            <div>
               {step_numbers.map((stepNumber, index) => (
                  <li key={index}>
                     {`Шаг ${stepNumber}:`}
                     <br />
                     <img src={`${baseUrl}/${file_path[index]}`} alt="Фото шага" width={300} height={200} />
                     <div style={{ width: "300px", overflowWrap: "break-word" }}>{step_descriptions[index]}</div>
                  </li>
               ))}
            </div>
            <br />
            <button onClick={handleDeleteOrder}>Удалить заявку</button>
            <button onClick={handleAddOrder}>Добавить заявку</button>
         </div>
      </div>
   );
}

export default OrderDetails;
