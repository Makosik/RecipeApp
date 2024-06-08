require('dotenv').config();
const jwt = require('jsonwebtoken');
const accessTokenSecret = process.env.ACCESS_TOKEN_PRIVATE_KEY;
const refreshTokenSecret = process.env.REFRESH_TOKEN_PRIVATE_KEY;

const authMiddleware = (req, res, next) => {
   const authHeader = req.headers['authorization'];
   const token = authHeader && authHeader.split(' ')[1];
   if (!token) {
      return res.status(401).json({ message: 'No token provided, authorization denied' });
   }
   try {
      const decoded = jwt.verify(token, accessTokenSecret);
      req.user = decoded;
      next();
   } catch (err) {
      return res.status(401).json({ message: 'Token is not valid' });
   }
};
const refreshToken = (req, res) => {
   const { token } = req.body;
   if (!token) {
      return res.status(401).json({ message: 'No token provided' });
   }
   try {
      const decoded = jwt.verify(token, refreshTokenSecret);
      const newAccessToken = jwt.sign({
         userId: decoded.userId,
         userName: decoded.userName,
         email: decoded.email,
         isAdmin: decoded.isAdmin
      }, accessTokenSecret, { expiresIn: '1h' });
      return res.status(200).json({ accessToken: newAccessToken });
   } catch (err) {
      return res.status(401).json({ message: 'Refresh token is not valid' });
   }
};

const adminMiddleware = (req, res, next) => {
   if (req.user && req.user.isAdmin === true) {
      next();
   } else {
      return res.status(403).json({ message: 'Access denied, admin only' });
   }
};

module.exports = { authMiddleware, refreshToken, adminMiddleware };