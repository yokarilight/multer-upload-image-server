const httpStatusCodes = require('../constants/statusCode');
const { successMsgs, errMsgs } = require('../constants/msgs');
const Image = require('../models/imageModel');
const successHandle = require('../utils/successHandler');
const errorHandle = require('../utils/errorHandler');
const { s3, s3Uploadv2 } = require('../utils/s3Utils');
const { imageApiValidate } = require('../utils/apiValidate');
const { deleteImagesValidate } = imageApiValidate;

const images = {
  getImages: async (res) => {
    try {
      const allImages = await Image.find();
      successHandle(res, allImages);
    }
    catch (err) {
      errorHandle(res, err, httpStatusCodes.BAD_REQUEST);
    }
  },
  createSingleImage: async (req, res) => {
    if (!req.files) {
      errorHandle(res, { message: errMsgs.POST_CREATE_SINGLE_IMAGE_FILE_REQUIRED }, httpStatusCodes.BAD_REQUEST);

      return;
    }

    try {
      const result = await s3Uploadv2(req.files);
      
      const newImage = new Image({
        imageUrl: result[0].Location,
        imageName: result[0].key,
        imageDeleteHash: result[0].Key,
      });

      await newImage.save();
      successHandle(res, successMsgs.POST_CREATE_SINGLE_IMAGE_NAME_SUCCESS);
    }
    catch (err) {
      errorHandle(res, err, httpStatusCodes.BAD_REQUEST);
    }
  },
  deleteSingleImage: async (req, res) => {
    const { id, imagename } = req.params;

    if (!id || !imagename) {
      errorHandle(res, { message: errMsgs.DELETE_IMAGE_ID_IMAGE_NAME_REQUIRED }, httpStatusCodes.BAD_REQUEST);

      return;
    }

    try {
      deleteImagesValidate({ id, imagename });
      await s3.deleteObject({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: imagename,
      }).promise();

      await Image.findByIdAndDelete(id);

      successHandle(res, successMsgs.DELETE_SUCCESS);

    } catch (err) {
      errorHandle(res, err, httpStatusCodes.BAD_REQUEST);
    }
  },
  
  // getPosts: async (res) => {
  //   const allPosts = await Post.find();
  //   successHandle(res, allPosts);
  // },
  // getSinglePost: async (req, res) => {
  //   try {
  //     const { id } = req.params;
  //     const targetPost = await Post.findById(id);
  //     successHandle(res, targetPost);
  //   } catch (err) {
  //     errorHandle(res, err, httpStatusCodes.BAD_REQUEST);
  //   }
  // },
  // createSinglePost: async (req, res) => {
  //   try {
  //     const data = req.body;
  //     if (!data || !Object.values(data).length) {
  //       throw Error('invalid data!');
  //     }
  //     const newPost = await Post.create(data);
  //     successHandle(res, newPost);
  //   } catch (err) {
  //     errorHandle(res, err, httpStatusCodes.BAD_REQUEST);
  //   }
  // },
  // editSinglePost: async (req, res) => {
  //   try {
  //     const { id } = req.params;
  //     const data = req.body;
  //     if (!data || !Object.values(data).length) {
  //       throw Error('invalid data!');
  //     }
  //     const editPost = await Post.findByIdAndUpdate(id, data, { new: true });
  //     if (editPost === null) {
  //       throw Error('cannot find post');
  //     }
  //     successHandle(res, editPost);
  //   } catch (err) {
  //     errorHandle(res, err, httpStatusCodes.BAD_REQUEST);
  //   }
  // },
  // deleteAllPosts: async (res) => {
  //   try {
  //     await Post.deleteMany();
  //     successHandle(res, []);
  //   } catch (err) {
  //     errorHandle(res, err, httpStatusCodes.BAD_REQUEST);
  //   }
  // },
  // deleteSinglePost: async (req, res) => {
  //   try {
  //     const { id } = req.params;
  //     await Post.findByIdAndDelete(id);
  //     const allPosts = await Post.find();
  //     successHandle(res, allPosts);
  //   } catch (err) {
  //     errorHandle(res, err, httpStatusCodes.BAD_REQUEST);
  //   }
  // },
}

module.exports = images;
