const httpStatusCodes = require('../constants/statusCode');
const { successMsgs, errMsgs } = require('../constants/msgs');
const File = require('../models/fileModel');
const { getTimeNow } = require('../utils/utils');
const successHandle = require('../utils/successHandler');
const errorHandle = require('../utils/errorHandler');
const { s3, s3Uploadv2 } = require('../utils/s3Utils');
const { fileApiValidate } = require('../utils/apiValidate');
const {
  getFilesValidate,
  getSingleFileValidate,
  createSignFileValidate,
  updateSignInfoValidate,
  updateFileInfoValidate,
  deleteFilesValidate
} = fileApiValidate;

const checkDuplicateFile = async (req, res) => {
  const existFile = await File.findOne({
    'fileName': req.files[0].originalname
  });

  if (existFile) {
    errorHandle(res, { message: `${existFile.fileName} ${errMsgs.DUPLICATE_FILE_NAME}` }, httpStatusCodes.BAD_REQUEST);

    return;
  }
}

const checkDuplicateTitle = async (title, res) => {
  const existFile = await File.findOne({
    'signTitle': title
  });

  if (existFile) {
    errorHandle(res, { message: errMsgs.DUPLICATE_TITLE }, httpStatusCodes.BAD_REQUEST);

    return;
  }
}

const files = {
  getFiles: async (req, res) => {
    const { from, count } = req.query;

    try {
      getFilesValidate({ from, count });

      const allFilesSize = await File.count();
      const allFiles = await File.find().skip(from).limit(count);
      const data = {
        'data': allFiles,
        'size': allFilesSize
      };

      successHandle(res, data);
    }
    catch (err) {
      errorHandle(res, err, httpStatusCodes.BAD_REQUEST);
    }
  },
  getSingleFile: async (req, res) => {
    const { id } = req.params;

    try {
      getSingleFileValidate(id);

      const targetFile = await File.findOne({
        '_id': id
      });

      if (targetFile === null) {
        errorHandle(res, { message: errMsgs.NO_FILE_FOUND }, httpStatusCodes.BAD_REQUEST);

        return;
      }

      successHandle(res, targetFile);
    }
    catch (err) {
      errorHandle(res, err, httpStatusCodes.BAD_REQUEST);
    }
  },
  createSignatureFile: async (req, res) => {
    const { fileName } = req.body;

    try {
      await createSignFileValidate(req);
      const results = await s3Uploadv2(req.files);
      const timeNow = getTimeNow();

      const newFile = new File({
        signTitle: `${new Date(timeNow).toLocaleString()}-example`,
        fileLocation: results[0].Location,
        fileName: fileName,
        fileKey: results[0].Key,
        fileEtag: results[0].ETag,
        fileBucket: results[0].Bucket,
        isSigned: false,
        date: timeNow,
        modifiedDate: timeNow,
      });

      const newFileRes = await newFile.save();

      successHandle(res, { id: newFileRes._id, message: successMsgs.POST_CREATE_SUCCESS });
    }
    catch (err) {
      errorHandle(res, err, httpStatusCodes.BAD_REQUEST);
    }
  },
  // update only title and isSigned
  updateSignatureInfo: async (req, res) => {
    const { id } = req.params;
    const { title, isSigned } = req.body;

    const targetFile = await File.findOne({
      '_id': id
    });

    if (targetFile === null) {
      errorHandle(res, { message: errMsgs.NO_FILE_FOUND }, httpStatusCodes.BAD_REQUEST);

      return;
    }

    try {
      await updateSignInfoValidate({ id , title, isSigned });

      const filter = {
        '_id': id
      };

      const update = {
        signTitle: title || targetFile.signTitle,
        isSigned: isSigned ?? targetFile.isSigned,
        modifiedDate: getTimeNow(),
      };

      await File.findOneAndUpdate(filter, update);
      successHandle(res, successMsgs.PATCH_UPDATE_SUCCESS);
    }
    catch (err) {
      errorHandle(res, err, httpStatusCodes.BAD_REQUEST);
    }
  },
  // reupload new file
  updateFileInfo: async (req, res) => {
    const { id } = req.params;
    const { fileName } = req.body;

    const targetFile = await File.findOne({
      '_id': id
    });

    if (targetFile === null) {
      errorHandle(res, { message: errMsgs.NO_FILE_FOUND }, httpStatusCodes.BAD_REQUEST);

      return;
    }

    try {
      await updateFileInfoValidate(req, id);
      await s3.deleteObject({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: targetFile.fileName,
      }).promise();

      const filter = {
        '_id': id
      };

      const results = await s3Uploadv2(req.files);

      const update = {
        fileLocation: results[0].Location,
        fileName: fileName,
        fileKey: results[0].Key,
        fileEtag: results[0].ETag,
        fileBucket: results[0].Bucket,
        modifiedDate: getTimeNow(),
      };

      await File.findOneAndUpdate(filter, update);
      successHandle(res, successMsgs.PATCH_UPDATE_SUCCESS);
    }
    catch (err) {
      errorHandle(res, err, httpStatusCodes.BAD_REQUEST);
    }
  },
  deleteFiles: async (req, res) => {
    const { id, filename } = req.params;

    try {
      deleteFilesValidate({ id, filename });
      await s3.deleteObject({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: filename,
      }).promise();

      await File.findByIdAndDelete(id);

      successHandle(res, successMsgs.DELETE_SUCCESS);
    }
    catch (err) {
      errorHandle(res, err, httpStatusCodes.BAD_REQUEST);
    }
  }
}

module.exports = files;
