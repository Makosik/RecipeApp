const {getDishes, getIngredients, deleteDish, createDish, getDishById} = require("../models/dishes")

class DishesController {

   async getDishes(req, res) {
      const dishes = await getDishes(req.body);
      res.json(dishes.rows);
   }

   async getDishById(req, res) {
      const {id} = req.params;
      try {
         const dish = await getDishById(id);
         if (dish) {
            res.json(dish);
         } else {
            res.status(404).json({ message: 'Такого рецепта нет' });
         }
      } catch (error) {
         console.error('Ошибка при получении деталей рецепта:', error);
         res.status(500).json({ message: 'Ошибка при получении деталей рецепта' });
       }
   }

   async getIngredients(req, res) {
      const ingredients = await getIngredients(req.body);
      res.json(ingredients.rows);
   }

   async deleteDish(req, res) {
      try {
        await deleteDish(req.params);
         res.json({ success: true, message: 'Рецепт успешно удален' });
      } catch (error) {
         console.error('Ошибка при удалении рецепта:', error);
         res.status(500).json({ error: 'Ошибка при удалении рецепта' });
      }
   }

   async createDish(req, res) {
      try {
         await createDish(req.body);
         res.status(201).json({ message: 'Блюдо успешно создано' });
      } catch (error) {
         console.error('Ошибка при создании блюда:', error);
         res.status(500).json({ error: 'Ошибка при создании блюда' });
      }
   }

}
module.exports = new DishesController();