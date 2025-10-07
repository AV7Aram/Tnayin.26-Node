const express = require('express');
const router = express.Router();
const { CartController } = require('../controller/CartController');
const cartController = new CartController();
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, cartController.getCart);
router.post('/add', authenticate, cartController.addToCart);
router.put('/', authenticate, cartController.updateCart);
router.delete('/', authenticate, cartController.clearCart);
module.exports = router;