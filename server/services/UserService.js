const fs = require('fs');
const path = require('path');

class UserService {
    constructor(models) {
        this.models = models;
    }

    async getUserById(id) {
        return await this.models.user.findById(id);
    }

    async updateAvatar(id, file) {
        const user = await this.getUserById(id);

        if (user.avatar) {
            const oldPath = path.join(__dirname, '..', user.avatar);
            fs.unlink(oldPath, () => { });
        }

        user.avatar = `/uploads/${file.filename}`;
        await user.save();
        return user.avatar;
    }

    async deleteAvatar(id) {
        const user = await this.getUserById(id);
        
        if (user.avatar) {
            const avatarPath = path.join(__dirname, '..', user.avatar);
            fs.unlink(avatarPath, () => { });
            user.avatar = '';
            await user.save();
        }
        return true;
    }
}

module.exports = { UserService };