const {getOrders, deleteOrder, addOrder,} = require("../models/orders")

class OrdersController {
   async getOrders(req, res) {
      const orders = await getOrders(req.body)
      res.json(orders.rows);
   }

   async deleteOrder(req, res) {
      try {
         await deleteOrder(req.params)
         res.json({ success: true, message: 'Заявка успешно удалена' });
      } catch (error) {
         console.error('Ошибка при удалении заявки:', error);
         res.status(500).json({ error: 'Ошибка при удалении заявки' });
      }
   }

   async addOrder(req, res) {
      try {
         await addOrder(req.body)
         res.json({ success: true, message: 'Блюдо и его ингредиенты успешно добавлены' });
      } catch (error) {
         console.error('Ошибка при добавлении блюда и его ингредиентов:', error);
         res.status(500).json({ error: 'Ошибка при добавлении блюда и его ингредиентов' });
      }
   }

}

module.exports = new OrdersController();