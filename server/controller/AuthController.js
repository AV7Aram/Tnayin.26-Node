class AuthController {
    async register(req, res) {
        try {
            const { email, password, username } = req.body;

            const existingUser = await req.app.locals.services.auth.findUserByEmail(email);
            if (existingUser) {
                return res.status(400).json({ error: 'User already exists' });
            }

            const userId = await req.app.locals.services.auth.createUser({
                email,
                password,
                username
            });

            res.status(201).json({ 
                message: 'User created successfully', 
                userId 
            });
        } catch (error) {
            console.error('Register error:', error);
            res.status(400).json({ error: error.message });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            
            const user = await req.app.locals.services.auth.findUserByEmail(email);

            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

           const isPasswordValid = await req.app.locals.services.auth.validatePassword(user, password);
            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            res.json({
                message: 'Login successful',
                user: {
                    id: user._id,
                    email: user.email,
                    role: user.role,
                    username: user.username
                }
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = { AuthController }