const express = require('express');
const router = express.Router();
const { UserController } = require('../controller/UserController');
const userController = new UserController();
const { authenticate } = require('../middleware/auth');
const { upload } = require('../middleware/avatar');

router.get('/:id', authenticate, userController.getUser);
router.post('/:id/avatar', authenticate, upload.single('avatar'), userController.uploadAvatar);
router.delete('/:id/avatar', authenticate, userController.deleteAvatar);

module.exports = router;