const fs = require('fs');
const path = require('path');

class UserController {
    async getUser(req, res) {
        try {
            const user = await req.app.locals.models.user.findById(req.params.id);
            if (!user) return res.status(404).json({ error: 'User not found' });
            res.json(user);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async uploadAvatar(req, res) {
        try {
            const user = await req.app.locals.models.user.findById(req.params.id);
            if (!user) return res.status(404).json({ error: 'User not found' });

            if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

            if (user.avatar) {
                const oldPath = path.join(__dirname, '..', user.avatar);
                fs.unlink(oldPath, err => {});
            }

            user.avatar = `/uploads/${req.file.filename}`;
            await user.save();
            res.json({ success: true, avatar: user.avatar });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async deleteAvatar(req, res) {
        try {
            const user = await req.app.locals.models.user.findById(req.params.id);
            if (!user) return res.status(404).json({ error: 'User not found' });

            if (user.avatar) {
                const avatarPath = path.join(__dirname, '..', user.avatar);
                fs.unlink(avatarPath, err => {});
                user.avatar = '';
                await user.save();
            }
            res.json({ success: true });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = { UserController };