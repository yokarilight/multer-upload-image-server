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
      return cb(new Error('Only pdf file allowed!'));
      // cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE'), false);
    }
    
    cb(undefined, true);
  }
});

router.get('/', (req, res, next) => {
  /**
    * #swagger.tags = ['Files - 文件相關API']
    * #swagger.description = 'Get all files API'
    * #swagger.parameters['from'] = {
        in: 'query',
        description: '從第幾筆開始',
      }
    * #swagger.parameters['count'] = {
        in: 'query',
        description: '數量',
      }
    * #swagger.responses[200] = {
        description: 'Response',
        schema: {
          "status": true,
          "code": 200,
          "data": {
            "data": [{
              "_id": "63d13d5a2782fdfa5e2f239d",
              "signTitle": "example",
              "fileLocation": "https://nodejs-signature-document-s3.s3.amazonaws.com/%E6%9C%80%E9%AB%98%E5%AD%B8%E7%BF%92%E6%B3%95%E5%BF%83%E5%BE%97.docx",
              "fileName": "最高學習法心得.docx",
              "fileKey": "最高學習法心得.docx",
              "fileEtag": "\"15c0de85bce4f03fea5da6a77e0db16b\"",
              "fileBucket": "nodejs-signature-document-s3",
              "isSigned": false,
              "date": 1681046272553,
              "modifiedDate": 1681046272553,
            }],
            "size": 100
          }
        }
      }
    */
  fileController.getFiles(req, res);
});

router.get('/:id', (req, res, next) => {
  /**
    * #swagger.tags = ['Files - 文件相關API']
    * #swagger.description = 'Get single file API'
    * #swagger.responses[200] = {
        description: 'Response',
        schema: {
          "status": true,
          "code": 200,
          "data": {
            "_id": "63d13d5a2782fdfa5e2f239d",
            "signTitle": "example",
            "fileLocation": "https://nodejs-signature-document-s3.s3.amazonaws.com/%E6%9C%80%E9%AB%98%E5%AD%B8%E7%BF%92%E6%B3%95%E5%BF%83%E5%BE%97.docx",
            "fileName": "最高學習法心得.docx",
            "fileKey": "最高學習法心得.docx",
            "fileEtag": "\"15c0de85bce4f03fea5da6a77e0db16b\"",
            "fileBucket": "nodejs-signature-document-s3",
            "isSigned": false,
            "date": 1681046272553,
            "modifiedDate": 1681046272553,
          }
        }
      }
    */
  fileController.getSingleFile(req, res);
});

router.post('/', upload.array('file'), (req, res, next) => {
  /**
    * #swagger.tags = ['Files - 文件相關API']
    * #swagger.description = 'Create signature file API'
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
          "code": 200,
          "data": {
            "id": "63d13d5a2782fdfa5e2f239d",
            "message": "Create successfully"
          }
        }
      }
    */
  fileController.createSignatureFile(req, res);
});

router.patch('/:id/signInfo', (req, res, next) => {
  /**
    * #swagger.tags = ['Files - 文件相關API']
    * #swagger.description = 'Patch signature title and isSigned status API'
    * #swagger.parameters['obj'] = {
        in: 'body',
        description: '簽署物件新的標題和簽署狀態',
        schema: {
          $title: 'new title',
          $isSigned: true
        }
      }
    * #swagger.responses[200] = {
        description: 'Response',
        schema: {
          "status": true,
          "code": 200,
          "data": "Update successfully"
        }
      }
    */
  fileController.updateSignatureInfo(req, res);
});

router.patch('/:id/fileInfo', upload.array('file'), (req, res, next) => {
  /**
    * #swagger.tags = ['Files - 文件相關API']
    * #swagger.description = 'Patch file info API'
    * #swagger.parameters['file'] = {
        in: 'formData',
        type: 'file',
        description: 'Single file that you upload',
      }
    * #swagger.responses[200] = {
        description: 'Response',
        schema: {
          "status": true,
          "code": 200,
          "data": "Update successfully"
        }
      }
    */
  fileController.updateFileInfo(req, res);
});

router.delete('/:id/filename/:filename', (req, res, next) => {
  /**
    * #swagger.tags = ['Files - 文件相關API']
    * #swagger.description = 'Delete File API'
    * #swagger.responses[200] = {
        description: 'Response',
        schema: {
          "status": true,
          "code": 200,
          "data": "Delete file successfully"
        }
      }
    */
  fileController.deleteFiles(req, res);
});

module.exports = router;
