const httpStatusCodes = require('../constants/statusCode');
const Image = require('../models/imageModel');
const successHandle = require('../utils/successHandler');
const errorHandle = require('../utils/errorHandler');

// const imageTypes = [ 'image/png', 'image/jpg', 'image/jpeg' ];

// const upload = multer({
// 	dest: 'images',
// 	limits: {
// 		fileSize: 1000000
// 	},
// 	fileFilter(req, file, cb) {
// 		if (!imageTypes.includes(file.mimetype)) {
// 			return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
// 		}

// 		cb(undefined, true);
// 	}
// });

const images = {
	getImages: async (res) => {

	},
	getSingleImages: async (req, res) => {

	},
	createSingleImage: async (req, res) => {
		try {
			console.log('req.body', req.body)
			console.log('req.file', req.file)
			const newImage = new Image({
				name: req.body.name,
				image: {
					data: req.file.filename,
					contentType: req.file.mimetype
				},
			});

			await newImage.save();
			res.send('successfully upload image');
		}
		catch (error) {
			res.status(400).send({ error: error.message });
		}
	},
	deleteAllImages: async (res) => {

	},
	deleteSingleImage: async (req, res) => {

	},
	
	// getPosts: async (res) => {
	// 	const allPosts = await Post.find();
	// 	successHandle(res, allPosts);
	// },
	// getSinglePost: async (req, res) => {
	// 	try {
	// 		const { id } = req.params;
	// 		const targetPost = await Post.findById(id);
	// 		successHandle(res, targetPost);
	// 	} catch (err) {
	// 		errorHandle(res, err, httpStatusCodes.BAD_REQUEST);
	// 	}
	// },
	// createSinglePost: async (req, res) => {
	// 	try {
	// 		const data = req.body;
	// 		if (!data || !Object.values(data).length) {
	// 			throw Error('invalid data!');
	// 		}
	// 		const newPost = await Post.create(data);
	// 		successHandle(res, newPost);
	// 	} catch (err) {
	// 		errorHandle(res, err, httpStatusCodes.BAD_REQUEST);
	// 	}
	// },
	// editSinglePost: async (req, res) => {
	// 	try {
	// 		const { id } = req.params;
	// 		const data = req.body;
	// 		if (!data || !Object.values(data).length) {
	// 			throw Error('invalid data!');
	// 		}
	// 		const editPost = await Post.findByIdAndUpdate(id, data, { new: true });
	// 		if (editPost === null) {
	// 			throw Error('cannot find post');
	// 		}
	// 		successHandle(res, editPost);
	// 	} catch (err) {
	// 		errorHandle(res, err, httpStatusCodes.BAD_REQUEST);
	// 	}
	// },
	// deleteAllPosts: async (res) => {
	// 	try {
	// 		await Post.deleteMany();
	// 		successHandle(res, []);
	// 	} catch (err) {
	// 		errorHandle(res, err, httpStatusCodes.BAD_REQUEST);
	// 	}
	// },
	// deleteSinglePost: async (req, res) => {
	// 	try {
	// 		const { id } = req.params;
	// 		await Post.findByIdAndDelete(id);
	// 		const allPosts = await Post.find();
	// 		successHandle(res, allPosts);
	// 	} catch (err) {
	// 		errorHandle(res, err, httpStatusCodes.BAD_REQUEST);
	// 	}
	// },
}

module.exports = images;
