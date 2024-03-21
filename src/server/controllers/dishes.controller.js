const db = require("../db");

class DishesController {
   async createDish(req, res) {
      const [title] = req.body;
      //const newDish = await db.query("insert into Dishes (title) values (яичница) returning *")
      console.log(title);
      res.json(newDish.row);
   }
   async getDishes(req, res) {
      const dishes = await db.query("select * from dishes")
      res.json(dishes.rows);
   }
}




module.exports = new DishesController();