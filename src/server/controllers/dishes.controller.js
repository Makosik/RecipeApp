const db = require("../db");

class DishesController {
   // async createDish(req, res) {
   //    const { title } = req.body;
   //    try {
   //       const newDish = await db.query("INSERT INTO Dishes (title) VALUES ($1) RETURNING *", [title]);
   //       res.json(newDish.rows[0]);
   //    } catch (error) {
   //       console.error("Error inserting dish:", error);
   //       res.status(500).json({ error: "Error inserting dish" });
   //    }
   // }

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

   async getIngredients(req,res){
      const ingredients = await db.query(`select * from Ingredients;`)
      res.json(ingredients.rows);
   }

   async createDish(req, res){
      const { dish_title, ingredient_id } = req.body;
      try {
        // Добавление соответствия блюда и ингредиента в таблицу Dishes_Ingredients
        await db.query('INSERT INTO orders (dish_title, ingredient_id) VALUES ($1, $2)', [dish_title, ingredient_id]);
        res.status(201).json({ message: 'Ингредиент успешно добавлен к блюду' });
      } catch (error) {
        console.error('Ошибка при добавлении ингредиента к блюду:', error);
        res.status(500).json({ error: 'Ошибка при добавлении ингредиента к блюду' });
      }
    };
}




module.exports = new DishesController();