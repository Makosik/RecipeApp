const Router = require('express');
const router = new Router;
const fileMiddleware = require('../middleware/file')
const uploadsController = require('../controllers/uploads.controller');

router.post('/upload', fileMiddleware.fields([
   { name: 'photo', maxCount: 20 },
   { name: 'coverPhoto', maxCount: 1 }
]), uploadsController.upload);

module.exports = router;