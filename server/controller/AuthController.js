class AuthController {
    async register(req, res) {
        try {
            const user = await req.app.locals.services.auth.register(req.body);

            res.status(201).json({ 
                message: 'User created successfully', 
                user 
            });
        } catch (error) {
            console.error('Register error:', error);
            res.status(400).json({ error: error.message });
        }
    }

    async login(req, res) {
        try {
            const result = await req.app.locals.services.auth.login(req.body);

            res.json({
                message: 'Login successful',
                token: result.token,
                user: result.user
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(401).json({ error: error.message });
        }
    }
}

module.exports = { AuthController }