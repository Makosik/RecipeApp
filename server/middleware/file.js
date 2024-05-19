const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
    destination(req, file, cb) {
        if (file.fieldname === 'coverPhoto') {
            cb(null, 'uploads/coverPhoto/');
        } else {
            cb(null, 'uploads/');
        }
    },
    filename(req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + uuidv4(); // уникальный идентификатор
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

module.exports = upload;
