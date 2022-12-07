const { ImgurClient } = require('imgur');
const httpStatusCodes = require('../constants/statusCode');
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
    try {
      const client = new ImgurClient({
        clientId: process.env.IMGUR_CLIENTID,
        clientSecret: process.env.IMGUR_CLIENT_SECRET,
        refreshToken: process.env.IMGUR_REFRESH_TOKEN,
      });
      
      const response = await client.upload({
        image: req.file.buffer.toString('base64'),
        type: 'base64',
        title: req.body.name,
        album: process.env.IMGUR_ALBUM_ID
      });

      const newImage = new Image({
        imageUrl: response.data.link,
        imageName: response.data.title,
        imageDeleteHash: response.data.deletehash,
      });

      await newImage.save();
      res.send('successfully upload image');
    }
    catch (err) {
      errorHandle(res, err, httpStatusCodes.BAD_REQUEST);
    }
  },
  deleteSingleImage: async (req, res) => {
    try {
      const client = new ImgurClient({
        clientId: process.env.IMGUR_CLIENTID,
        clientSecret: process.env.IMGUR_CLIENT_SECRET,
        refreshToken: process.env.IMGUR_REFRESH_TOKEN,
      });

      const { id } = req.params;
      const hash = req.body.hash;
      await Image.findByIdAndDelete(id);
      await client.deleteImage(hash);
      const allImages = await Image.find();
      successHandle(res, allImages);
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
