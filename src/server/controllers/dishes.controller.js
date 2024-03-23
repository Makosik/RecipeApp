const db = require("../db");

class DishesController {

   async getDishes(req, res) {
      const dishes = await db.query(
         `SELECT Dishes.title AS dish_title, 
         ARRAY_AGG(Ingredients.title) AS ingredient_titles
         FROM Dishes
         JOIN Dishes_Ingredients ON Dishes.id = Dishes_Ingredients.dish_id
         JOIN Ingredients ON Ingredients.id = Dishes_Ingredients.ingredient_id
         GROUP BY Dishes.title;`)
      res.json(dishes.rows);
   }

   async getIngredients(req, res) {
      const ingredients = await db.query(`select * from Ingredients;`)
      res.json(ingredients.rows);
   }

   async createDish(req, res) {
      const { dish_title, ingredient_id } = req.body;
      try {
         await db.query('INSERT INTO orders (dish_title, ingredient_id) VALUES ($1, $2)', [dish_title, ingredient_id]);
         res.status(201).json({ message: 'Ингредиент успешно добавлен к блюду' });
      } catch (error) {
         console.error('Ошибка при добавлении ингредиента к блюду:', error);
         res.status(500).json({ error: 'Ошибка при добавлении ингредиента к блюду' });
      }
   };

   async getOrders(req, res) {
      const orders = await db.query(
         `SELECT
   o.id AS order_id,
   o.dish_title,
   ARRAY_AGG(i.title) AS ingredients
   FROM orders o
   JOIN LATERAL unnest(o.ingredient_id) AS ing_id ON true
   JOIN ingredients i ON i.id = ing_id
   GROUP BY o.id, o.dish_title
   ORDER BY o.id;`)
      res.json(orders.rows);
   }

   async deleteOrder(req, res) {
      try {
          const { order_id } = req.params;
          const result = await db.query('DELETE FROM orders WHERE id = $1', [order_id]);
          res.json({ success: true, message: 'Заказ успешно удален' });
      } catch (error) {
          console.error('Ошибка при удалении заказа:', error);
          res.status(500).json({ error: 'Ошибка при удалении заказа' });
      }
  }

}




module.exports = new DishesController();