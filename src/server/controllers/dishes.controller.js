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
      const dishes = await db.query("select * from dishes;")
      res.json(dishes.rows);
   }
}




module.exports = new DishesController();