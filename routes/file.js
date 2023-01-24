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
  fileController.getFiles(res);
});

router.post('/', upload.array('file'), (req, res, next) => {
  fileController.uploadFiles(req, res);
});

router.get('/download/:filename', (req, res, next) => {
  fileController.downloadFiles(req, res);
});

router.delete('/:id', (req, res, next) => {
  fileController.deleteFiles(req, res);
});

module.exports = router;
