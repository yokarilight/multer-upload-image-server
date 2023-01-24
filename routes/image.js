const express = require('express');
const router = express.Router();
const multer = require('multer');
const { ImageTypes } = require('../constants/mimeTypes');
const imageController = require('../controllers/images');

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 2
  },
  fileFilter(req, file, cb) {
    if (!ImageTypes.includes(file.mimetype)) {
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
      // cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE'), false);
    }

    cb(undefined, true);
  }
});

router.get('/', (req, res, next) => {
  imageController.getImages(res);
});

router.get('/:id', (req, res, next) => {
  imageController.getSingleImages(req, res);
});

router.post('/', upload.single('image'), (req, res, next) => {
  imageController.createSingleImage(req, res);
});

router.delete('/', (req, res, next) => {
  imageController.deleteAllImages(res);
});

router.delete('/:id', (req, res, next) => {
  imageController.deleteSingleImage(req, res);
});

module.exports = router;
