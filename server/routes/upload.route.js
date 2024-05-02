const Router = require('express');
const router = new Router;
const fileMiddleware = require('../middleware/file')
const uploadsController = require('../controllers/uploads.controller');

router.post('/upload', fileMiddleware.single('photo'), uploadsController.upload);

module.exports = router;