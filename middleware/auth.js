const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
  
  if (!token) {
    return res.sendStatus(401); // Unauthorized
  }

  jwt.verify(token, 'yourSecretKey', (err, user) => {
    if (err) {
      return res.sendStatus(403); // Forbidden
    }
    
    req.user = user; // Attach user to request
    next(); // Call next middleware
  });
};

module.exports = authenticateToken;
