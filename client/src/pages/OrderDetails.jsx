import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navigation from '../components/Navigation';
import '../style/OrderDetails.css';

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

   const { order_id, user_id, created_at, dish_title, ingredients, ingredient_id, order_description, step_numbers, step_descriptions, coverphoto, file_path } = orderDetails;
   const baseUrl = 'http://localhost:3000';


   return (
      <div className="order-details-container">
         <div className="order-details-wrap">
            <div className='order-details'>

               <Navigation />
               <h2 className="order-details-header">Детали заказа #{order_id}</h2>
               <div className="order-info">
                  <div>Заявка номер: {order_id}</div>
                  <div>user_id: {user_id}</div>
                  <div>Дата заявки: {created_at}</div>
                  <div>Название блюда: {dish_title}</div>
               </div>
               <div className='flexWrap'>
                  <img
                     className="order-coverphoto"
                     src={`${baseUrl}/${coverphoto}`}
                     alt={dish_title}
                  />

                  <ul className="ingredient-list-order">
                     <label> Ингредиенты:</label>
                     {ingredients.map((ingredient, index) => (
                        <li key={index}>{ingredient}</li>
                     ))}
                  </ul>
               </div>
            </div>
            <div className="order-description">Описание: {order_description}</div>
            <ul className="step-list">
               {step_numbers.map((stepNumber, index) => (
                  <li key={index}>
                     {`Шаг ${stepNumber}:`}
                     <br />
                     <img
                        className="step-image"
                        src={`${baseUrl}/${file_path[index]}`}
                        alt={`Шаг ${stepNumber}`}
                     />
                     <div className="step-description">
                        {step_descriptions[index]}
                     </div>
                  </li>
               ))}
            </ul>
            <div className="order-buttons">
               <button className="order-button-del" onClick={handleDeleteOrder}>
                  Удалить заявку
               </button>
               <button className="order-button" onClick={handleAddOrder}>
                  Добавить заявку
               </button>
            </div>
         </div>
      </div>
   );

}

export default OrderDetails;
