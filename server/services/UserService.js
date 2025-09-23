class UserService {
    constructor(models) {
        this.models = models;
    }

    async findUserByEmail(email) {
        return await this.models.user.findOne({ email });
    }

    async createUser(userData) {
        const user = new this.models.user(userData);
        await user.save();
        return user._id;
    }

    async getUserCart(userId) {
        return await this.models.cart.findOne({ userId }).populate('items.productId');
    }

    async updateUserCart(userId, cartItems) {
        return await this.models.cart.findOneAndUpdate(
            { userId },
            { items: cartItems, updatedAt: new Date() },
            { upsert: true, new: true }
        )
    }
}

module.exports = { UserService };