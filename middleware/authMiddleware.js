const jwt = require('jsonwebtoken');

const authMiddleware = (roles = []) => {
  return (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Failed to authenticate token' });
      }

      req.user = decoded;
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Access denied' });
      }

      next();
    });
  };
};

module.exports = authMiddleware;