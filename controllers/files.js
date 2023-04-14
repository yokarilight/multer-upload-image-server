const { S3 } = require('aws-sdk');
const httpStatusCodes = require('../constants/statusCode');
const { successMsgs, errMsgs } = require('../constants/msgs');
const File = require('../models/fileModel');
const { isNaturalNumber, isValidFrom, getTimeNow, checkQueryParamIsBool, queryParamToBool } = require('../utils/utils');
const successHandle = require('../utils/successHandler');
const errorHandle = require('../utils/errorHandler');

const s3 = new S3();

// get S3 all files in the bucket
const s3GetFiles = async () => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
  };

  return await s3.listObjects(params).promise();
}

const s3Uploadv2 = async (files) => {
  const params = files.map((file) => {
    return {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: file.originalname,
      Body: file.buffer,
    };
  });

  return await Promise.all(params.map((param) => s3.upload(param).promise()));
}

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

    if (!isValidFrom(Number(from))) {
      errorHandle(res, { message: errMsgs.GET_FILES_FROM_ERROR }, httpStatusCodes.BAD_REQUEST);

      return;
    }

    if (!isNaturalNumber(Number(count))) {
      errorHandle(res, { message: errMsgs.GET_FILES_COUNT_ERROR }, httpStatusCodes.BAD_REQUEST);

      return;
    }

    try {
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

    if (!id) {
      errorHandle(res, { message: errMsgs.FILE_ID_REQUIRED }, httpStatusCodes.BAD_REQUEST);

      return;
    }

    try {
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
    if (!req.files.length) {
      errorHandle(res, { message: errMsgs.CREATE_FILE_SIGN_REQ_FILES_REQUIRED }, httpStatusCodes.BAD_REQUEST);

      return;
    }

    const existFile = await File.findOne({
      'fileName': req.files[0].originalname
    });
  
    if (existFile) {
      errorHandle(res, { message: `${existFile.fileName} ${errMsgs.DUPLICATE_FILE_NAME}` }, httpStatusCodes.BAD_REQUEST);
  
      return;
    }

    try {
      const results = await s3Uploadv2(req.files);
      const timeNow = getTimeNow();

      const newFile = new File({
        signTitle: `${new Date(timeNow).toLocaleString()}-example`,
        fileLocation: results[0].Location,
        fileName: req.files[0].originalname,
        fileKey: results[0].Key,
        fileEtag: results[0].ETag,
        fileBucket: results[0].Bucket,
        isSigned: false,
        date: timeNow,
        modifiedDate: timeNow,
      });

      await newFile.save();
      successHandle(res, successMsgs.POST_CREATE_SUCCESS);
    }
    catch (err) {
      errorHandle(res, err, httpStatusCodes.BAD_REQUEST);
    }
  },
  // update only title and isSigned
  updateSignatureInfo: async (req, res) => {
    const { id } = req.params;

    const { title, isSigned } = req.body;

    if (!id) {
      errorHandle(res, { message: errMsgs.FILE_ID_REQUIRED }, httpStatusCodes.BAD_REQUEST);

      return;
    }

    if (isSigned === false) {
      errorHandle(res, { message: errMsgs.CANNOT_CHANGE_SIGN_STATUS_TO_UNFINISHED }, httpStatusCodes.BAD_REQUEST);

      return;
    }

    if (isSigned && typeof isSigned !== 'boolean') {
      errorHandle(res, { message: errMsgs.ISSIGNED_SHOULD_BE_BOOLEAN }, httpStatusCodes.BAD_REQUEST);

      return;
    }

    const existFile = await File.findOne({
      'signTitle': title
    });
  
    if (existFile) {
      errorHandle(res, { message: errMsgs.DUPLICATE_TITLE }, httpStatusCodes.BAD_REQUEST);
  
      return;
    }

    const targetFile = await File.findOne({
      '_id': id
    });

    if (targetFile === null) {
      errorHandle(res, { message: errMsgs.NO_FILE_FOUND }, httpStatusCodes.BAD_REQUEST);

      return;
    }

    try {
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

    if (!id) {
      errorHandle(res, { message: errMsgs.FILE_ID_REQUIRED }, httpStatusCodes.BAD_REQUEST);

      return;
    }

    const existFile = await File.findOne({
      'fileName': req?.files?.[0]?.originalname
    });
  
    if (existFile) {
      errorHandle(res, { message: `${existFile.fileName} ${errMsgs.DUPLICATE_FILE_NAME}` }, httpStatusCodes.BAD_REQUEST);
  
      return;
    }

    const targetFile = await File.findOne({
      '_id': id
    });

    if (targetFile === null) {
      errorHandle(res, { message: errMsgs.NO_FILE_FOUND }, httpStatusCodes.BAD_REQUEST);

      return;
    }

    try {
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
        fileName: req.files[0].originalname,
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

    if (!id || !filename) {
      errorHandle(res, { message: errMsgs.DELETE_FILES_FILENAME_REQUIRED }, httpStatusCodes.BAD_REQUEST);
    }

    try {
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
