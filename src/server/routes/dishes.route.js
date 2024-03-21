const Router = require('express');
const router = new Router;

const dishesController = require('../controllers/dishes.controller');

router.post("/dish", dishesController.createDish);
router.get("/dishes", dishesController.getDishes);
router.get("/ingredietns",dishesController.getIngredients);





module.exports = router;

