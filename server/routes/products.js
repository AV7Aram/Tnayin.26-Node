var express = require('express');
var router = express.Router();
const { ProductController } = require('../controller/ProductController');
const productController = new ProductController();
const { authenticate, requireAdmin } = require('../middleware/auth');

/* GET home page. */
router.get('/', productController.getProducts);
router.post('/', authenticate, requireAdmin, productController.createProduct);
router.put('/:id', authenticate, requireAdmin, productController.updateProduct);
router.delete('/:id', authenticate, requireAdmin, productController.deleteProduct);

module.exports = router;
