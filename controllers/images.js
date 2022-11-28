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
  getSingleImages: async (req, res) => {

  },
  createSingleImage: async (req, res) => {
    try {
			const encode_image = req.file.buffer.toString('base64');
      const newImage = new Image({
        name: req.body.name,
        image: {
          data: encode_image,
          contentType: req.file.mimetype
        },
      });

      await newImage.save();
      res.send('successfully upload image');
    }
    catch (err) {
			errorHandle(res, err, httpStatusCodes.BAD_REQUEST);
    }
  },
  deleteAllImages: async (res) => {

  },
  deleteSingleImage: async (req, res) => {

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
