const jwt = require("jsonwebtoken")
const bcrypt = require('bcryptjs');

class AuthService {
    constructor(models) {
        this.models = models;
    }

    async register(body) {
        const existingUser = await this.models.users.findOne({ email: body.email });
        if (existingUser) {
            throw new Error('User already exists');
        }

        const doc = await this.models.users(body)
        const user = await doc.save()
        const { __v, password, ...userData } = user._doc
        return { ...userData }
    }

    async login(body) {
        const user = await this.models.users.findOne({ email: body.email })
        if (!user) {
            throw new Error('Invalid login or password');
        }

        const validUser = await bcrypt.compare(body.password, user.password)
        if (!validUser) {
            throw new Error('Invalid login or password');
        }

        const token = jwt.sign({
            id: user._id,
            role: user.role
        }, '1234', { expiresIn: '1d' });
        
        const { __v, password, ...userData } = user._doc

        return {
            token,
            user: userData
        }
    }
}

module.exports = { AuthService };