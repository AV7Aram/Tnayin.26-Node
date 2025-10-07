class ProductController {
    async getProducts(req, res) {
        try {
            const products = await req.app.locals.services.prod.getProducts();
            res.json(products);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getProductById(req, res) {
        try {
            const product = await req.app.locals.services.prod.getProductById(req.params.id);
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }
            console.log('Product found:', product);
            console.log('Additional images:', product.additionalImages);
            res.json(product);
        } catch (error) {
            console.error('Error getting product:', error);
            res.status(500).json({ error: error.message });
        }
    }
    async createProduct(req, res) {
        try {
            const productId = await req.app.locals.services.prod.createProduct(req.body);
            res.status(201).json({ id: productId, message: 'Product created' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async updateProduct(req, res) {
        try {
            const updated = await req.app.locals.services.prod.updateProduct(
                req.params.id,
                req.body
            );
            if (!updated) {
                return res.status(404).json({ error: 'Product not found' });
            }
            res.json({ success: true, updated });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    async deleteProduct(req, res) {
        try {
            const deletedCount = await req.app.locals.services.prod.deleteProduct(req.params.id);
            if (deletedCount === 0) {
                return res.status(404).json({ error: 'Product not found' });
            }
            res.json({ deleted: deletedCount, message: 'Product deleted' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async addProductImage(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'No file uploaded' });
            }

            const imagePath = `/uploads/${req.file.filename}`;
            console.log('Adding image:', imagePath, 'to product:', req.params.id);

            const product = await req.app.locals.services.prod.addProductImage(req.params.id, imagePath);

            console.log('Updated product:', product);

            res.json({ success: true, product });
        } catch (error) {
            console.error('Error adding product image:', error);
            res.status(400).json({ error: error.message });
        }
    }
    async removeProductImage(req, res) {
        try {
            const { imagePath } = req.body;
            const product = await req.app.locals.services.prod.removeProductImage(req.params.id, imagePath);

            res.json({ success: true, product });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = { ProductController }