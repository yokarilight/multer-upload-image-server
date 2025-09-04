const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');

router.post('/', (req, res) => {
  usersController.createUser(req, res);
});

router.get('/', (req, res) => {
  usersController.getUsers(res);
});

router.get('/:id', (req, res) => {
  usersController.getUser(req, res);
});

router.patch('/:id', (req, res) => {
  usersController.updateUser(req, res);
});

router.delete('/:id', (req, res) => {
  usersController.deleteUser(req, res);
});

module.exports = router;
