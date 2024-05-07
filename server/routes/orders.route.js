const Router = require('express');
const router = new Router;

const ordersController = require('../controllers/orders.controller');

router.get("/orders", ordersController.getOrders);
router.delete("/orders/:order_id", ordersController.deleteOrder);
router.post("/addOrder", ordersController.addOrder);


module.exports = router;