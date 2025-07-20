const {verifyToken} = require("../utils/jwt");

const requireAuth = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized access" });
  }

  const decoded = verifyToken(token);
  
  if (!decoded) {
    return res.status(403).json({ message: "Forbidden: Invalid token" });
  }

  req.user = decoded; // Attach user info to request
  next();
};

module.exports = {requireAuth};
