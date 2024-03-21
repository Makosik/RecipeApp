const db = require("../db");

class DishesController {
   async createDish(req, res) {
      const { title } = req.body;
      try {
         const newDish = await db.query("INSERT INTO Dishes (title) VALUES ($1) RETURNING *", [title]);
         res.json(newDish.rows[0]);
      } catch (error) {
         console.error("Error inserting dish:", error);
         res.status(500).json({ error: "Error inserting dish" });
      }
   }

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
}




module.exports = new DishesController();