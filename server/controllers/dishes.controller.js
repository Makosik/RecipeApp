const db = require("../db");

class DishesController {

   async getDishes(req, res) {

      const dishes = await db.query(
         `SELECT
         Dishes.title AS dish_title,
         ARRAY_AGG(DISTINCT Ingredients.title) AS ingredient_titles,
         orders.description AS description,
         ARRAY_AGG(DISTINCT stepsForOrders.step_number) AS step_numbers,
         ARRAY_AGG(DISTINCT stepsForOrders.step_description) AS step_descriptions
     FROM
         orders
     JOIN
	 	   dishes ON dishes.order_id = orders.id 
     JOIN
         Dishes_Ingredients ON Dishes.id = Dishes_Ingredients.dish_id
     JOIN
         Ingredients ON Ingredients.id = Dishes_Ingredients.ingredient_id
     LEFT JOIN
         stepsForOrders ON Dishes.order_id = stepsForOrders.order_id
     GROUP BY
         Dishes.title, orders.description
     ORDER BY
         MAX(Dishes_Ingredients.created_at_DI) DESC;
     `)
      res.json(dishes.rows);
   }

   async getIngredients(req, res) {
      const ingredients = await db.query(`select * from Ingredients;`)
      res.json(ingredients.rows);
   }

   async createDish(req, res) {
      const { dish_title, ingredient_id, description, cookingSteps } = req.body;
      try {
         const result = await db.query('INSERT INTO orders (dish_title, ingredient_id, description) VALUES ($1, $2, $3) RETURNING id', [dish_title, ingredient_id, description]);
         const orderId = result.rows[0].id; // Получаем id вставленной записи
   
         // Вставляем информацию о каждом шаге
         for (const step of cookingSteps) {
            await db.query('INSERT INTO stepsForOrders (order_id, step_number, step_description) VALUES ($1, $2, $3)', [orderId, step.step_number, step.step_description]);
         }
   
         res.status(201).json({ message: 'Блюдо успешно создано' });
      } catch (error) {
         console.error('Ошибка при создании блюда:', error);
         res.status(500).json({ error: 'Ошибка при создании блюда' });
      }
   }
   

   async createSteps(res,req){
      
   }

   async getOrders(req, res) {
      const orders = await db.query(
         `SELECT
         o.id AS order_id,
         o.dish_title,
         o.description AS order_description,
         TO_CHAR(o.created_at, 'DD.MM.YYYY HH24:MI') AS created_at,
         ARRAY_AGG(DISTINCT i.title) AS ingredients,
         ARRAY_AGG(DISTINCT i.id) AS ingredient_id,
         ARRAY_AGG(DISTINCT s.step_number) AS step_numbers,
         ARRAY_AGG(DISTINCT s.step_description) AS step_descriptions
     FROM orders o
     JOIN LATERAL unnest(o.ingredient_id) AS ing_id ON true
     JOIN ingredients i ON i.id = ing_id
     LEFT JOIN LATERAL (
         SELECT
             step_number,
             step_description
         FROM stepsForOrders s
         WHERE s.order_id = o.id
     ) s ON true
     WHERE o.is_deleted = FALSE
     GROUP BY o.id, o.dish_title, o.description, created_at
     ORDER BY o.id;
     `)
      res.json(orders.rows);
   }

   async deleteOrder(req, res) {
      try {
         const { order_id } = req.params;
         const result = await db.query('UPDATE orders SET is_deleted = true WHERE id = $1', [order_id]);
         res.json({ success: true, message: 'Заявка успешно удален' });
      } catch (error) {
         console.error('Ошибка при удалении заявки:', error);
         res.status(500).json({ error: 'Ошибка при удалении заявки' });
      }
   }

   async addOrder(req, res) {
      try {
         const { dish_title, ingredient_id, description, step_numbers, step_descriptions, order_id } = req.body;

         // 1. Добавляем блюдо в таблицу Dishes и получаем его ID
         const dishResult = await db.query('INSERT INTO Dishes (title, order_id) VALUES ($1, $2) RETURNING id', [dish_title, order_id]);
         const dish_id = dishResult.rows[0].id;
         // 2. Добавляем ингредиенты блюда в таблицу Dishes_Ingredients
         const insertIngredients = ingredient_id.map(ingredient_id => {
            return db.query('INSERT INTO Dishes_Ingredients (dish_id, ingredient_id) VALUES ($1, $2)', [dish_id, ingredient_id]);
         });
         await Promise.all(insertIngredients);
         res.json({ success: true, message: 'Блюдо и его ингредиенты успешно добавлены' });
      } catch (error) {
         console.error('Ошибка при добавлении блюда и его ингредиентов:', error);
         res.status(500).json({ error: 'Ошибка при добавлении блюда и его ингредиентов' });
      }
   }


}




module.exports = new DishesController();