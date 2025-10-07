var express = require('express');
var router = express.Router();
const { ProductController } = require('../controller/ProductController');
const productController = new ProductController();
const { authenticate, requireAdmin } = require('../middleware/auth');
const { upload } = require('../middleware/avatar');

/* GET home page. */
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
router.post('/', authenticate, requireAdmin, productController.createProduct);
router.put('/:id', authenticate, requireAdmin, productController.updateProduct);
router.delete('/:id', authenticate, requireAdmin, productController.deleteProduct);

router.post('/:id/images', authenticate, requireAdmin, upload.single('image'), productController.addProductImage);
router.delete('/:id/images', authenticate, requireAdmin, productController.removeProductImage);

module.exports = router;