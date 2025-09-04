const { errMsgs } = require('../constants/msgs');
const httpStatusCodes = require('../constants/statusCode');
const errorHandle = require('../utils/errorHandler');
const { verifyAccessToken } = require('../utils/jwt');

const requireAuth = (req, res, next) => {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) {
    errorHandle(res, { message: errMsgs.MISSING_TOKEN }, httpStatusCodes.AUTHORIZATION_ERROR);

    return;
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, role: payload.role };
    next();
  }
  catch {
    errorHandle(res, { message: errMsgs.INVALID_OR_EXPIRED_TOKEN }, httpStatusCodes.AUTHORIZATION_ERROR);

    return;
  }
};

module.exports = { requireAuth };
