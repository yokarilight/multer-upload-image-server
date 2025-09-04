const jwt = require('jsonwebtoken');

const signAccessToken = (user) => jwt.sign(
  { sub: user._id.toString(), role: user.role },
  process.env.JWT_ACCESS_SECRET,
  { issuer: process.env.JWT_ISSUER, expiresIn: '15m' }
);

const verifyAccessToken = (token) => jwt.verify(token, process.env.JWT_ACCESS_SECRET, { issuer: process.env.JWT_ISSUER });

module.exports = { signAccessToken, verifyAccessToken };
