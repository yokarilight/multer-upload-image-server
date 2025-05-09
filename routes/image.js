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
  /**
   * #swagger.tags = ['Images - 圖片相關API']
   * #swagger.description = 'Get All Images API'
   * #swagger.responses[200] = {
      description: 'Response',
      schema: {
        "status": true,
        "data": [{
          "_id": "63d14c3955bd40e5a3bda371",
          "imageUrl": "https://i.imgur.com/plkurey.jpg",
          "imageName": "philly",
          "imageDeleteHash": "WT8EUyxW10rKSv2"
        }]
      }
    }
    */
  imageController.getImages(res);
});

// router.get('/:id', (req, res, next) => {
//   imageController.getSingleImages(req, res);
// });

router.post('/', upload.array('image'), (req, res, next) => {
  /**
    * #swagger.tags = ['Images - 圖片相關API']
    * #swagger.description = 'Upload Image API'
    * #swagger.parameters['image'] = {
        in: 'formData',
        type: 'file',
        required: 'true',
        description: 'Single image that you upload',
      }
    * #swagger.responses[200] = {
        description: 'Response',
        schema: {
          "status": true,
          "data": "Upload image successfully"
        }
      }
    */
  imageController.createSingleImage(req, res);
});

// router.delete('/', (req, res, next) => {
//   imageController.deleteAllImages(res);
// });

router.delete('/:id/imagename/:imagename', (req, res, next) => {
  /**
    * #swagger.tags = ['Images - 圖片相關API']
    * #swagger.description = 'Delete Image API'
    * #swagger.responses[200] = {
        description: 'Response',
        schema: {
          "status": true,
          "data": "Delete image successfully"
        }
      }
    */
  imageController.deleteSingleImage(req, res);
});

module.exports = router;
