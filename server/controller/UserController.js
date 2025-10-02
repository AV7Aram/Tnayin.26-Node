class UserController {
    async getUser(req, res) {
        try {
            const user = await req.app.locals.services.user.getUserById(req.params.id);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(user);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async uploadAvatar(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'No file uploaded' });
            }
            const avatar = await req.app.locals.services.user.updateAvatar(req.params.id, req.file);
            res.json({ success: true, avatar });
        } catch (error) {
            if (error.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ error: 'File size exceeds the 10MB limit' });
            }
            res.status(400).json({ error: error.message });
        }
    }

    async deleteAvatar(req, res) {
        try {
            await req.app.locals.services.user.deleteAvatar(req.params.id);
            res.json({ success: true });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = { UserController }