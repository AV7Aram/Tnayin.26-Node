const express = require('express');
const { AuthController } = require('../controller/AuthController');
const authController = new AuthController();
const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;