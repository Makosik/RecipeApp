import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ShowOrders() {
   const [orders, setOrders] = useState([]);

   useEffect(() => {
      const fetchData = async () => {
         try {
            const result = await axios.get('/api/orders');
            setOrders(result.data);
         } catch (error) {
            console.error('Ошибка при получении заказов:', error);
         }
      };

      fetchData();
   });

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

   return (
      <div>
         <h1>Orders:</h1>
         <div>
            {orders.map(order => (
               <div key={order.order_id}>
                  <div>Заявка номер: {order.order_id}</div>
                  {order.dish_title}
                  <ul>
                     {order.ingredients.map(ingredient => (
                        <li key={ingredient}>{ingredient}</li>
                     ))}
                  </ul>
                  <button type="button" onClick={() => handleDeleteOrder(order.order_id)}>Удалить заявку</button>
               </div>
            ))}
         </div>
      </div>
   );
}

export default ShowOrders;