const Router = require('express');
const router = new Router;

const dishesController = require('../controllers/dishes.controller');

router.post("/createDish", dishesController.createDish);
router.get("/dishes", dishesController.getDishes);
router.get("/ingredients",dishesController.getIngredients);
router.delete("/dishes/:dish_id", dishesController.deleteDish);


module.exports = router;

