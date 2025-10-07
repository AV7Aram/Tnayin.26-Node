class CartService {
    constructor(models) {
        this.models = models;
    }

    async getCart(userId) {
        const cart = await this.models.cart.findOne({ userId }).populate('items.productId');
        if (!cart) {
            // Возвращаем пустую корзину вместо null
            return { userId, items: [] };
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
        const product = await this.models.prod.findById(productId);
        if (!product) {
            throw new Error('Product not found');
        }

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
        return await this.getCart(userId); 
    }

    async updateCart(userId, items) {
        for (const item of items) {
            const product = await this.models.prod.findById(item.productId);
            if (!product) {
                throw new Error(`Product with id ${item.productId} not found`);
            }
        }

        const cart = await this.models.cart.findOneAndUpdate(
            { userId },
            { items, updatedAt: new Date() },
            { new: true, upsert: true }
        );
        return await this.getCart(userId);
    }

    async clearCart(userId) {
        const cart = await this.models.cart.findOneAndUpdate(
            { userId },
            { items: [], updatedAt: new Date() },
            { new: true }
        );
        return await this.getCart(userId);
    }
}

module.exports = { CartService };