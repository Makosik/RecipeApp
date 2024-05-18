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

   return { message: 'User registered successfully', user: { 
      userId: newUser.rows[0].id, 
      userName: newUser.rows[0].user_name,
      email: newUser.rows[0].mail,
      isAdmin: newUser.rows[0].is_admin } };
}

async function login(loginData) {
   const { mail, user_password } = loginData;
   const user = await db.query('SELECT * FROM users WHERE mail = $1', [mail]);
   if (user.rows.length === 0 || !await bcrypt.compare(user_password, user.rows[0].user_password)) {
      throw new Error('Authentication failed');
   }
   const token = jwt.sign({ 
      userId: user.rows[0].id, 
      userName: user.rows[0].user_name,
      email: user.rows[0].mail,
      isAdmin: user.rows[0].is_admin }, 
      'my-secret-key', { expiresIn: '3h' });

   return { message: 'Authentication successful', token };
}

async function createAdmin() {
   const adminData = {
       user_name: 'admin',
       mail: 'admin@mail.com',
       user_password: await bcrypt.hash('admin', 10), 
       is_admin: true
   };
   try {
       const existingAdmin = await db.query('SELECT * FROM users WHERE is_admin = $1 LIMIT 1', [true]);
       
       if (existingAdmin.rows.length === 0 ) {
           const admin = await db.query(
            'INSERT INTO users (user_name, mail, user_password, is_admin) VALUES ($1, $2, $3, $4) RETURNING *',
            [adminData.user_name, adminData.mail, adminData.user_password, adminData.is_admin]
         );
           console.log('Администратор успешно создан');
       }
   } catch (error) {
       console.error('Ошибка при создании администратора:', error);
   }
}

module.exports = {
   register,
   login,
   createAdmin,
};
