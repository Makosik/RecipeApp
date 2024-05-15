const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
   const authHeader = req.headers['authorization'];
   const token = authHeader && authHeader.split(' ')[1];
   if (!token) {
      return res.status(401).json({ message: 'No token provided, authorization denied' });
   }

   try {
      const decoded = jwt.verify(token, 'my-secret-key');
      req.user = decoded;
      next();
   } catch (err) {
      return res.status(401).json({ message: 'Token is not valid' });
   }
};

const adminMiddleware = (req, res, next) => {
   if (req.user && req.user.isAdmin === true) {
      next();
   } else {
      return res.status(403).json({ message: 'Access denied, admin only' });
   }
};

module.exports = { authMiddleware, adminMiddleware };