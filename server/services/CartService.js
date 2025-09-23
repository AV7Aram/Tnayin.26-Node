class CartService {
    constructor(models) {
        this.models = models;
    }

    async getCart(userId) {
        const cart = await this.models.cart.findOne({ userId }).populate('items.productId');
        if (!cart) {
            return null;
        }
        const items = cart.items.map(item => ({
            ...item.toObject(),
            product: item.productId,
        }));
        return {
            ...cart.toObject(),
            items,
        };
    }

    async addToCart(userId, productId, quantity = 1) {
        let cart = await this.models.cart.findOne({ userId });
        if (!cart) {
            cart = new this.models.cart({ userId, items: [] });
        }
        const existingItemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        if (existingItemIndex >= 0) {
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            cart.items.push({ productId, quantity });
        }
        cart.updatedAt = new Date();
        await cart.save();
        return cart;
    }

    async updateCart(userId, items) {
        return await this.models.cart.findOneAndUpdate(
            { userId },
            { items, updatedAt: new Date() },
            { new: true, upsert: true }
        );
    }

    async clearCart(userId) {
        return await this.models.cart.findOneAndUpdate(
            { userId },
            { items: [], updatedAt: new Date() },
            { new: true }
        );
    }
}

module.exports = { CartService };