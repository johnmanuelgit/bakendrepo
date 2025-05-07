const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: Bearer TOKEN

  if (!token) return res.status(401).json({ error: 'Token required' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });

    // Normalize payload to always provide req.user.userId
    req.user = {
      userId: decoded.userId || decoded._id || decoded.id,
      ...decoded
    };

    if (!req.user.userId) {
      return res.status(400).json({ error: 'Token payload missing userId' });
    }

    next();
  });
}

module.exports = authenticateToken;
