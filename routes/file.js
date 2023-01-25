const express = require('express');
const router = express.Router();
const multer = require('multer');
const { FileTypes } = require('../constants/mimeTypes');
const fileController = require('../controllers/files');

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { 
    fileSize: 1024 * 1024 * 2,
    files: 1
  },
  fileFilter(req, file, cb) {
    if (!FileTypes.includes(file.mimetype)) {
      return cb(new Error('Only .pdf, .csv, .doc, .docx, .ppt, .pptx, .xls and .xlsx format allowed!'));
      // cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE'), false);
    }
    
    cb(undefined, true);
  }
});

router.get('/', (req, res, next) => {
  /**
   * #swagger.tags = ['Files - 文件相關API']
   * #swagger.description = 'Get All Files API'
   * #swagger.responses[200] = {
      description: 'Response',
      schema: {
        "status": true,
        "data": [{
          "_id": "63d13d5a2782fdfa5e2f239d",
          "fileLocation": "https://nodejs-signature-document-s3.s3.amazonaws.com/%E6%9C%80%E9%AB%98%E5%AD%B8%E7%BF%92%E6%B3%95%E5%BF%83%E5%BE%97.docx",
          "fileName": "最高學習法心得.docx",
          "fileKey": "最高學習法心得.docx",
          "fileEtag": "\"15c0de85bce4f03fea5da6a77e0db16b\"",
          "fileBucket": "nodejs-signature-document-s3",
        }]
      }
    }
    */
  fileController.getFiles(res);
});

router.post('/', upload.array('file'), (req, res, next) => {
  /**
    * #swagger.tags = ['Files - 文件相關API']
    * #swagger.description = 'Upload File API'
    * #swagger.parameters['file'] = {
        in: 'formData',
        type: 'file',
        required: 'true',
        description: 'Single file that you upload',
      }
    * #swagger.responses[200] = {
        description: 'Response',
        schema: {
          "status": true,
          "data": "Upload file successfully"
        }
      }
    */
  fileController.uploadFiles(req, res);
});

router.get('/download', (req, res, next) => {
  /**
    * #swagger.tags = ['Files - 文件相關API']
    * #swagger.description = 'Download File API'
    * #swagger.parameters['obj'] = {
        in: 'body',
        description: 'Should attach filename',
        schema: {
          $filename: 'Your filename',
        }
      }
    * #swagger.responses[200] = {
        description: 'Response',
        schema: {
          "status": true,
          "data": {
            "type": "Buffer",
            "data": [80, 20, ......]
          }
        }
      }
    */
  fileController.downloadFiles(req, res);
});

router.delete('/:id', (req, res, next) => {
  /**
    * #swagger.tags = ['Files - 文件相關API']
    * #swagger.description = 'Delete File API'
    * #swagger.parameters['obj'] = {
        in: 'body',
        description: 'Should attach filename',
        schema: {
          $filename: 'Your filename',
        }
      }
    * #swagger.responses[200] = {
        description: 'Response',
        schema: {
          "status": true,
          "data": "Delete file successfully"
        }
      }
    */
  fileController.deleteFiles(req, res);
});

module.exports = router;
