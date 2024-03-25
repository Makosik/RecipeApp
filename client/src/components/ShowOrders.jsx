import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ShowOrders() {
   const [orders, setOrders] = useState([]);

   useEffect(() => {
      const fetchData = async () => {
         try {
            const result = await axios.get('/api/orders');
            setOrders(result.data);
            //console.log(result.data)
         } catch (error) {
            console.error('Ошибка при получении заказов:', error);
         }
      };

      fetchData();
   },[orders]);

   const handleDeleteOrder = async (order_id) => {
      try {
         // Отправляем запрос на сервер для удаления заявки
         const response = await axios.delete(`/api/orders/${order_id}`);
         console.log('Заявка успешно удалена:', response.data);
         // Здесь вы можете выполнить какие-либо дополнительные действия после успешного удаления, например, обновить список заказов
      } catch (error) {
         console.error('Ошибка при удалении заявки:', error);
         // Обработка ошибки, например, вывод сообщения пользователю
      }
   };

   const handleAddOrder = async (dish_title, order_id, ingredient_id) => {
      try {
         const response = await axios.post(`/api/addOrder`, { "dish_title": dish_title, "ingredient_id": ingredient_id });
         await handleDeleteOrder(order_id);
         console.log('Заявка успешно добавлена:', response.data);
         alert('Заявка успешно добавлена!');
      } catch (error) {
         console.error('Ошибка при добавлении заявки:', error)
         alert('Заявка успешно добавлена!');
      }
   };

   return (
      <div>
         <h1>Orders:</h1>
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
                  <button type="button" onClick={() => handleDeleteOrder(order.order_id)}>Удалить заявку</button>
                  <button type="button" onClick={() => handleAddOrder(order.dish_title, order.order_id, order.ingredient_id)}>Добавить заявку</button>
               </div>
            ))}
         </div>
      </div>
   );
}

export default ShowOrders;