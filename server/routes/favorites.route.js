const Router = require('express');
const router = new Router;
const { authMiddleware, adminMiddleware, refreshToken  } = require('../middleware/authMiddleware');
const favoritesController = require('../controllers/favorites.controller');

router.get("/favorites", authMiddleware, favoritesController.getFavorites);
router.delete("/favorites/:dish_id", authMiddleware, favoritesController.deleteFavorite);
router.post("/addFavorite", authMiddleware, favoritesController.addFavorite);
router.post('/refresh-token', refreshToken);


module.exports = router;