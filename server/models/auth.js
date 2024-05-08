const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require("./db");

async function register(userData) {
   const { user_name, mail, user_password } = userData;
   const hashedPassword = await bcrypt.hash(user_password, 10);

   const newUser = await db.query(
      'INSERT INTO users (user_name, mail, user_password) VALUES ($1, $2, $3) RETURNING *',
      [user_name, mail, hashedPassword]
   );

   return { message: 'User registered successfully', user: newUser.rows[0] };
}

async function login(loginData) {
   const { mail, user_password } = loginData;

   const user = await db.query('SELECT * FROM users WHERE mail = $1', [mail]);

   if (user.rows.length === 0 || !await bcrypt.compare(user_password, user.rows[0].user_password)) {
      throw new Error('Authentication failed');
   }

   const token = jwt.sign({ userId: user.rows[0].id, isAdmin: user.rows[0].is_admin }, 'my-secret-key', { expiresIn: '1h' });

   return { message: 'Authentication successful', token };
}

module.exports = {
   register,
   login,
};
