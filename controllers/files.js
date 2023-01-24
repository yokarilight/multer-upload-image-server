const { S3 } = require('aws-sdk');
const httpStatusCodes = require('../constants/statusCode');
const { successMsgs, errMsgs } = require('../constants/msgs');
const File = require('../models/fileModel');
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
  getFiles: async (res) => {
    try {
      const allFiles = await File.find();
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
      });

      await newFile.save();
      successHandle(res, successMsgs.POST_UPLOAD_FILES_SUCCESS);
    }
    catch (err) {
      errorHandle(res, err, httpStatusCodes.BAD_REQUEST);
    }
  },
  downloadFiles: async (req, res) => {
    try {
      const { filename } = req.params;
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
    const { id } = req.params;
    const { filename } = req.body;

    if (!id || !filename) {
      errorHandle(res, { message: errMsgs.DELETE_FILES_FILENAME_REQUIRED }, httpStatusCodes.BAD_REQUEST);
    }

    try {
      await s3.deleteObject({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: filename,
      }).promise();

      await File.findByIdAndDelete(id);

      successHandle(res, successMsgs.DELETE_FILES_FILENAME_REQUIRED);
    }
    catch (err) {
      errorHandle(res, err, httpStatusCodes.BAD_REQUEST);
    }
  }
}

module.exports = files;
