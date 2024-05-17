const Router = require('express');
const router = new Router;
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const usersController = require('../controllers/users.controller');

router.get("/users", authMiddleware,adminMiddleware, usersController.getUsers);
router.delete("/users/:userId", authMiddleware, adminMiddleware, usersController.deleteUsers);


module.exports = router;