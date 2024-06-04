const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
   const authHeader = req.headers['authorization'];
   const token = authHeader && authHeader.split(' ')[1];
   if (!token) {
      return res.status(401).json({ message: 'No token provided, authorization denied' });
   }

   try {
      const decoded = jwt.verify(token, 'my-secret-key');
      // const currentTime = Date.now() / 1000;

      // if (decoded.exp - currentTime < 600) {
      //    console.log('refresh token!')
      //    const newToken = jwt.sign({
      //       userId: decoded.userId,
      //       userName: decoded.userName,
      //       email: decoded.email,
      //       isAdmin: decoded.isAdmin
      //    }, 'my-secret-key', { expiresIn: '3h' });

      //    res.setHeader('Authorization', `Bearer ${newToken}`);
      //    return res.status(200).json({ token: newToken, message: 'Token refreshed' });
      // }

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