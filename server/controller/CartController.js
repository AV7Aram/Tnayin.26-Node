class CartController {
  async getCart(req, res) {
    try {
      const cart = await req.app.locals.services.cart.getCart(req.params.userId);
      res.json(cart);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async addToCart(req, res) {
    try {
      const { productId, quantity } = req.body;
      const cart = await req.app.locals.services.cart.addToCart(
        req.params.userId,
        productId,
        quantity || 1
      );
      res.json({ success: true, cart });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateCart(req, res) {
    try {
      const cart = await req.app.locals.services.cart.updateCart(
        req.params.userId,
        req.body.items
      );
      res.json(cart);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async clearCart(req, res) {
    try {
      const cart = await req.app.locals.services.cart.clearCart(req.params.userId);
      res.json(cart);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = { CartController };