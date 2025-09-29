class AuthService {
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
}

module.exports = { AuthService };