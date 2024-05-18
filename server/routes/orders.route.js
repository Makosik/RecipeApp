const Router = require('express');
const router = new Router;
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const ordersController = require('../controllers/orders.controller');

router.get("/orders", authMiddleware, adminMiddleware, ordersController.getOrders);
router.get("/order/:id", authMiddleware, adminMiddleware, ordersController.getOrderById);
router.delete("/orders/:order_id", authMiddleware, adminMiddleware, ordersController.deleteOrder);
router.post("/addOrder", authMiddleware, adminMiddleware, ordersController.addOrder);


module.exports = router;