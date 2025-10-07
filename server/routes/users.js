const express = require('express');
const router = express.Router();
const { UserController } = require('../controller/UserController');
const userController = new UserController();
const { authenticate } = require('../middleware/auth');
const { upload } = require('../middleware/avatar');

router.get('/profile', authenticate, userController.getUser);
router.post('/avatar', authenticate, upload.single('avatar'), userController.uploadAvatar);
router.delete('/avatar', authenticate, userController.deleteAvatar);

module.exports = router;