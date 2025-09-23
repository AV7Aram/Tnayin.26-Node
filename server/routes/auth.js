const express = require('express');
const { AuthController } = require('../controller/authController');
const authController = new AuthController();
const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;