const { addFavorite, deleteFavorite, getFavorites} = require("../models/favorites")

class FavoritesController {
   async getFavorites(req, res) {
      const { userId } = req.user;
      try {
         const favorites = await getFavorites(userId);
         res.json(favorites);
      } catch (error) {
         console.error('Ошибка при получении избранных рецептов:', error.message);
         res.status(500).json({ error: 'Ошибка при получении избранных рецептов' });
      }
   }

   async deleteFavorite(req, res) {
      const { userId } = req.user; 
      const { dish_id } = req.params;
      try {
         await deleteFavorite({ userId, dish_id })
         res.json({ success: true, message: 'Рецепт успешно удален из избранного' });
      } catch (error) {
         console.error('Ошибка при удалении рецепта:', error);
         res.status(500).json({ error: 'Ошибка при удалении рецепта' });
      }
   }

   async addFavorite(req, res) {
      const { userId } = req.user;
      const { dish_id } = req.body;
      try {
         await addFavorite({ userId, dish_id })
         res.json({ success: true, message: 'Рецепт успешно добавлен в избранное' });
      } catch (error) {
         console.error('Ошибка при добавлении рецепта в избранное:', error);
         res.status(500).json({ error: 'Ошибка при добавлении рецепта в избранное' });
      }
   }

}

module.exports = new FavoritesController();