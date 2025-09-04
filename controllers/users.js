const httpStatusCodes = require('../constants/statusCode');
const { successMsgs, errMsgs } = require('../constants/msgs');
const User = require('../models/userModel');
const successHandle = require('../utils/successHandler');
const errorHandle = require('../utils/errorHandler');
const bcrypt = require('bcrypt');

const users = {
  createUser: async (req, res) => {
    const { email, password, name, role } = req.body;

    if (!email || !password) {
      errorHandle(res, { message: errMsgs.POST_CREATE_USER_EMAIL_PASSWORD_REQUIRED }, httpStatusCodes.BAD_REQUEST);

      return;
    }

    try {
      const exists = await User.findOne({ email });
      if (exists) {
        errorHandle(res, { message: errMsgs.POST_CREATE_USER_EMAIL_TAKEN }, httpStatusCodes.CONFLICT);
        
        return;
      }

      const passwordHash = await bcrypt.hash(password, 12);
      const user = await User.create({ email, passwordHash, name, role });
      
      const { passwordHash: _, ...safe } = user.toObject();
      successHandle(res, safe, httpStatusCodes.CREATED);
    }
    catch (err) {
      errorHandle(res, err, httpStatusCodes.BAD_REQUEST);
    }
  },
  getUsers: async (res) => {
    try {
      const allUsers = await User.find().select('-passwordHash');

      successHandle(res, allUsers);
    }
    catch (err) {
      errorHandle(res, err, httpStatusCodes.BAD_REQUEST);
    }
  },
  getUser: async (req, res) => {
    const { id } = req.params;

    try {
      const user = await User.findById(id).select('-passwordHash');
      successHandle(res, user);
    }
    catch (err) {
      errorHandle(res, err, httpStatusCodes.BAD_REQUEST);
    }
  },
  updateUser: async (req, res) => {
    const { id } = req.params;
    const updates = { ...req.body };
    if (updates.password) {
      updates.passwordHash = await bcrypt.hash(updates.password, 12);
      delete updates.password;
    }

    try {
      const user = await User.findByIdAndUpdate(id, updates, { new: true }).select('-passwordHash');
      successHandle(res, user);
    }
    catch (err) {
      errorHandle(res, err, httpStatusCodes.BAD_REQUEST);
    }
  },
  deleteUser: async (req, res) => {
    const { id } = req.params;

    if (!id) {
      errorHandle(res, { message: errMsgs.DELETE_IMAGES_SUCCESS }, httpStatusCodes.BAD_REQUEST);

      return;
    }

    try {
      await User.findByIdAndDelete(id);
      successHandle(res, successMsgs.DELETE_SUCCESS);
    }
    catch (err) {
      errorHandle(res, err, httpStatusCodes.BAD_REQUEST);
    }
  },
}

module.exports = users;
