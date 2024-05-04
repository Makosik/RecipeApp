const Router = require('express');
const router = new Router;
const fileMiddleware = require('../middleware/file')
const uploadsController = require('../controllers/uploads.controller');

router.post('/upload', fileMiddleware.array('photo', 20), uploadsController.upload);

module.exports = router;