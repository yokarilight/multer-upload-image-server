const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const { requireAuth } = require('../middlewares/auth');

router.post('/login', (req, res) => {
  authController.login(req, res);
});

router.get('/me', requireAuth, (req, res) => {
  authController.getMe(req, res);
});

module.exports = router;