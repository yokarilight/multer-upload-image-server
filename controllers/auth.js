const bcrypt = require('bcrypt');
const { errMsgs } = require('../constants/msgs');
const httpStatusCodes = require('../constants/statusCode');
const User = require('../models/userModel');
const successHandle = require('../utils/successHandler');
const errorHandle = require('../utils/errorHandler');
const { signAccessToken } = require('../utils/jwt');

const auth = {
  login: async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      errorHandle(res, { message: errMsgs.INVALID_CREDENTIALS }, httpStatusCodes.AUTHORIZATION_ERROR);

      return;
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      errorHandle(res, { message: errMsgs.INVALID_CREDENTIALS }, httpStatusCodes.AUTHORIZATION_ERROR);

      return;
    }

    if (user.status !== 'active') {
      errorHandle(res, { message: errMsgs.USER_NOT_ACTIVE }, httpStatusCodes.FORBIDDEN);

      return;
    }

    try {
      const accessToken = signAccessToken(user);
      successHandle(res, { accessToken });
    }
    catch (err) {
      errorHandle(res, err, httpStatusCodes.BAD_REQUEST);
    }
  },
  getMe: async (req, res) => {
    const { id } = req.user;

    try {
      const user = await User.findById(id).select('-passwordHash');
      successHandle(res, user);
    }
    catch (err) {
      errorHandle(res, err, httpStatusCodes.BAD_REQUEST);
    }
  },
}

module.exports = auth;
