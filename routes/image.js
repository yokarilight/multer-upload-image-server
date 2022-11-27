const express = require('express');
const router = express.Router();
const multer = require('multer');
const imageController = require('../controllers/images');

const imageTypes = [ 'image/png', 'image/jpg', 'image/jpeg' ];

const upload = multer({
	dest: 'images',
	limits: {
		fileSize: 1000000
	},
	fileFilter(req, file, cb) {
		if (!imageTypes.includes(file.mimetype)) {
			return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
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
