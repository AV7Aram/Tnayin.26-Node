class ProductController {
    async getProducts(req, res) {
        try {
            const products = await req.app.locals.services.prod.getAllProducts();
            res.json(products);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async createProduct(req, res) {
        try {
            if (req.user.role !== 'admin') {
                return res.status(403).json({ error: 'Access denied' });
            }

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
            res.json({ success: true, updated });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    async deleteProduct(req, res) {
        try {
            if (req.user.role !== 'admin') {
                return res.status(403).json({ error: 'Access denied' });
            }

            const deleted = await req.app.locals.services.prod.deleteProduct(req.params.id);
            res.json({ deleted, message: 'Product deleted' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = { ProductController }