const express = require('express');
const router = express.Router();
const { CartController } = require('../controller/CartController');
const cartController = new CartController();
const { authenticate } = require('../middleware/auth');

router.get('/:userId', authenticate, cartController.getCart);
router.post('/:userId/add', authenticate, cartController.addToCart);
router.put('/:userId', authenticate, cartController.updateCart);
router.delete('/:userId', authenticate, cartController.clearCart);

module.exports = router;