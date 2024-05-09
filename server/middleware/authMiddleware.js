const jwt = require('jsonwebtoken');
const db = require('../models/db');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    jwt.verify(token, 'my-secret-key', async (err, user) => {
      console.log(user)
        if (err) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        try {
            const isAdmin = await db.query('SELECT is_admin FROM users WHERE id = $1', [user.userId]);
            if (isAdmin.rows.length === 0 || !isAdmin.rows[0].is_admin) {
                return res.status(403).json({ error: 'Forbidden. Only admins are allowed.' });
            }
        } catch (error) {
            console.error('Error checking user role:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }

        // Пользователь является администратором, пропускаем его дальше
        req.user = user;
        next();
    });
}

module.exports = {
    authenticateToken,
};
