const requireAdmin = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized access" });
    }

    const { verifyToken } = require('../utils/jwt');
    const decoded = verifyToken(token);
    
    if (!decoded || !decoded.isAdmin) {
        return res.status(403).json({ message: "Forbidden: Admins only" });
    }

    next();
}

module.exports = {requireAdmin};