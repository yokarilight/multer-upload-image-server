const { S3 } = require('aws-sdk');
const httpStatusCodes = require('../constants/statusCode');
const { successMsgs, errMsgs } = require('../constants/msgs');
const File = require('../models/fileModel');
const { isNaturalNumber, isValidFrom } = require('../utils/utils');
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

const files = {
  getFiles: async (req, res) => {
    const { from, count } = req.params;

    if (!isValidFrom(Number(from))) {
      errorHandle(res, { message: errMsgs.GET_FILES_FROM_ERROR }, httpStatusCodes.BAD_REQUEST);

      return;
    }

    if (!isNaturalNumber(Number(count))) {
      errorHandle(res, { message: errMsgs.GET_FILES_COUNT_ERROR }, httpStatusCodes.BAD_REQUEST);

      return;
    }

    try {
      const allFiles = await File.find().skip(from).limit(count);
      successHandle(res, allFiles);
    }
    catch (err) {
      errorHandle(res, err, httpStatusCodes.BAD_REQUEST);
    }
  },
  uploadFiles: async (req, res) => {
    if (!req.files.length) {
      errorHandle(res, { message: errMsgs.POST_UPLOAD_FILES_REQ_FILES_REQUIRED }, httpStatusCodes.BAD_REQUEST);

      return;
    }

    try {
      const results = await s3Uploadv2(req.files);

      const newFile = new File({
        fileLocation: results[0].Location,
        fileName: req.files[0].originalname,
        fileKey: results[0].Key,
        fileEtag: results[0].ETag,
        fileBucket: results[0].Bucket,
        isSigned: false,
      });

      await newFile.save();
      successHandle(res, successMsgs.POST_UPLOAD_FILES_SUCCESS);
    }
    catch (err) {
      errorHandle(res, err, httpStatusCodes.BAD_REQUEST);
    }
  },
  updateFileStatus: async (req, res) => {
    const { id } = req.params;
    const { isSigned } = req.body;

    if (!id) {
      errorHandle(res, { message: errMsgs.PATCH_UPDATE_FILE_STATUS_ID_REQUIRED }, httpStatusCodes.BAD_REQUEST);

      return;
    }

    if (!req.body.hasOwnProperty('isSigned')) {
      errorHandle(res, { message: errMsgs.PATCH_UPDATE_FILE_STATUS_BODY_ISSIGNED_REQUIRED }, httpStatusCodes.BAD_REQUEST);

      return;
    }

    if (typeof isSigned !== 'boolean') {
      errorHandle(res, { message: errMsgs.PATCH_UPDATE_FILE_STATUS_ISSIGNED_TYPE_ERROR }, httpStatusCodes.BAD_REQUEST);

      return;
    }

    try {
      const filter = {
        id: id
      };

      const update = {
        isSigned: isSigned
      };

      await File.findOneAndUpdate(filter, update);
      successHandle(res, successMsgs.PATCH_UPDATE_FILE_STATUS_SUCCESS);
    }
    catch (err) {
      errorHandle(res, err, httpStatusCodes.BAD_REQUEST);
    }
  },
  downloadFiles: async (req, res) => {
    const { filename } = req.body;
    
    try {
      const x = await s3.getObject({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: filename,
      }).promise();

      successHandle(res, x.Body);
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

      successHandle(res, successMsgs.DELETE_FILES_SUCCESS);
    }
    catch (err) {
      errorHandle(res, err, httpStatusCodes.BAD_REQUEST);
    }
  }
}

module.exports = files;
