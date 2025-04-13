//authMiddleware.js
import passport from '../config/passport.js';
const authenticateJWT = passport.authenticate('jwt', { session: false });

const authorizeRole = (roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Доступ запрещен' });
    }
    next();
};

export { authenticateJWT, authorizeRole };
