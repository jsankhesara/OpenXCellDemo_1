'use strict';

const multer = require('multer');
const path = require('path');
var config = require('../utils/config')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.defaultImageUploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}
const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = {
    upload
}