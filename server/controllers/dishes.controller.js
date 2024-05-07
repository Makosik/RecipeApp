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
      const { dish_title, ingredient_id, description, cookingSteps, uploadedFilesPaths } = req.body;
      console.log('photoUplload: ',uploadedFilesPaths)
      try {
         const result = await db.query('INSERT INTO orders (dish_title, ingredient_id, description) VALUES ($1, $2, $3) RETURNING id', [dish_title, ingredient_id, description]);
         const orderId = result.rows[0].id; // Получаем id вставленной записи
         
         for (const [index, step] of cookingSteps.entries()) {
            const stepData = [orderId, step.step_number, step.step_description, uploadedFilesPaths[index]];
            console.log('stepData: ',stepData)
            await db.query('INSERT INTO stepsForOrders (order_id, step_number, step_description, file_path) VALUES ($1, $2, $3, $4)', stepData);
        }
   
         res.status(201).json({ message: 'Блюдо успешно создано' });
      } catch (error) {
         console.error('Ошибка при создании блюда:', error);
         res.status(500).json({ error: 'Ошибка при создании блюда' });
      }
   }

}
module.exports = new DishesController();