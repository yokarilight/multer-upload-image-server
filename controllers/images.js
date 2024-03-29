const { ImgurClient } = require('imgur');
const fetch = require('node-fetch');
const httpStatusCodes = require('../constants/statusCode');
const { successMsgs, errMsgs } = require('../constants/msgs');
const Image = require('../models/imageModel');
const successHandle = require('../utils/successHandler');
const errorHandle = require('../utils/errorHandler');

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
    if (!req.file) {
      errorHandle(res, { message: errMsgs.POST_CREATE_SINGLE_IMAGE_FILE_REQUIRED }, httpStatusCodes.BAD_REQUEST);

      return;
    }

    try {
      const client = new ImgurClient({
        clientId: process.env.IMGUR_CLIENTID,
        clientSecret: process.env.IMGUR_CLIENT_SECRET,
        refreshToken: process.env.IMGUR_REFRESH_TOKEN,
      });
      
      const response = await client.upload({
        image: req.file.buffer.toString('base64'),
        type: 'base64',
        title: req.file.originalname,
        album: process.env.IMGUR_ALBUM_ID
      });

      const newImage = new Image({
        imageUrl: response.data.link,
        imageName: response.data.title,
        imageDeleteHash: response.data.deletehash,
      });

      await newImage.save();
      successHandle(res, successMsgs.POST_CREATE_SINGLE_IMAGE_NAME_SUCCESS);
    }
    catch (err) {
      errorHandle(res, err, httpStatusCodes.BAD_REQUEST);
    }
  },
  deleteSingleImage: async (req, res) => {
    const { id, hash, imageStr } = req.params;

    if (!id || !hash || !imageStr) {
      errorHandle(res, { message: errMsgs.DELETE_IMAGE_ID_REQUIRED }, httpStatusCodes.BAD_REQUEST);

      return;
    }

    try {
      const client = new ImgurClient({
        clientId: process.env.IMGUR_CLIENTID,
        clientSecret: process.env.IMGUR_CLIENT_SECRET,
        refreshToken: process.env.IMGUR_REFRESH_TOKEN,
      });

      const { status } = await fetch(`https://i.imgur.com/${imageStr}`);

      // something weird: if I remove some characters from the end of hash, it still can delete data from mongoDB
      // however, target image in imgur dashboard is still existed
      // e.g. hash: ABC123456 -> hash: ABC12345, will happen as above
      if (status === 200) {
        await client.deleteImage(hash);
        await Image.findByIdAndDelete(id);
        successHandle(res, successMsgs.DELETE_IMAGES_SUCCESS);
      }
      else {
        errorHandle(res, { message: errMsgs.CANNOT_FIND_THIS_IMAGE }, httpStatusCodes.BAD_REQUEST);
      }

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
