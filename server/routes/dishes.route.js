const Router = require('express');
const router = new Router;

const dishesController = require('../controllers/dishes.controller');

router.post("/createDish", dishesController.createDish);
router.get("/dishes", dishesController.getDishes);
router.get("/ingredients",dishesController.getIngredients);
router.get("/orders", dishesController.getOrders);
router.delete("/orders/:order_id", dishesController.deleteOrder);
router.post("/addOrder", dishesController.addOrder);


module.exports = router;

