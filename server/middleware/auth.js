const bcrypt = require('bcryptjs');

const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Basic ')) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const base64Credentials = authHeader.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        const [email, password] = credentials.split(':');
        
        const user = await req.app.locals.services.auth.findUserByEmail(email);
        
        if (!user) {
            return res.status(401).json({ error: 'Authentication failed' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Authentication failed' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ error: 'Authentication failed' });
    }
};

const requireAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};

module.exports = { authenticate, requireAdmin };