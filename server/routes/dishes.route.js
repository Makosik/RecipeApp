const Router = require('express');
const router = new Router;
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const dishesController = require('../controllers/dishes.controller');

router.post("/createDish",authMiddleware, dishesController.createDish);
router.get("/dishes", dishesController.getDishes);
router.get("/ingredients",dishesController.getIngredients);
router.delete("/dishes/:dish_id", authMiddleware, adminMiddleware, dishesController.deleteDish);
router.get('/dishes/:id',dishesController.getDishById)

module.exports = router;