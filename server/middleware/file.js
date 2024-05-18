const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination(req, file, cb) {
        if (file.fieldname === 'coverPhoto') {
            cb(null, 'uploads/coverPhoto/');
        } else {
            cb(null, 'uploads/');
        }
    },
    filename(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

module.exports = upload;
