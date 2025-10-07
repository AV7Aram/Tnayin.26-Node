const fs = require('fs');
const path = require('path');

class UserService {
    constructor(models) {
        this.models = models;
    }

    async getUser(id) {
        const user = await this.models.users.findById(id)
        if (!user) {
            throw new Error('User not found');
        }
        const { __v, password, ...userData } = user._doc
        return { ...userData }
    }

    async updateAvatar(id, file) {
        const user = await this.models.users.findById(id);
        if (!user) {
            throw new Error('User not found');
        }

        if (user.avatar && user.avatar !== '') {
            const oldPath = path.join(__dirname, '..', user.avatar);
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
        }

        user.avatar = `/uploads/${file.filename}`;
        await user.save();

        const { __v, password, ...userData } = user._doc;
        return userData.avatar;
    }

    async deleteAvatar(id) {
        const user = await this.models.users.findById(id);
        if (!user) {
            throw new Error('User not found');
        }

        if (user.avatar && user.avatar !== '') {
            const avatarPath = path.join(__dirname, '..', user.avatar);
            if (fs.existsSync(avatarPath)) {
                fs.unlinkSync(avatarPath);
            }
            user.avatar = '';
            await user.save();
        }
        return true;
    }
}

module.exports = { UserService };