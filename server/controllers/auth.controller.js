const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require("../db");// Предположим, что у вас есть модель User

async function register(req, res) {
   const { user_name, mail, user_password } = req.body;
   const hashedPassword = await bcrypt.hash(user_password, 10);
 
   try {
     const newUser = await db.query(
       'INSERT INTO users (user_name, mail, user_password) VALUES ($1, $2, $3) RETURNING *',
       [user_name, mail, hashedPassword]
     );
 
     res.status(201).json({ message: 'User registered successfully', user: newUser.rows[0] });
   } catch (error) {
     console.error('Error registering user:', error);
     res.status(500).json({ error: 'Internal server error' });
   }
 }
 
 async function login(req, res) {
   const { mail, user_password } = req.body;
 
   try {
     const user = await db.query('SELECT * FROM users WHERE mail = $1', [mail]);
 
     if (user.rows.length === 0) {
       return res.status(401).json({ error: 'Authentication failed' });
     }
 
     const passwordMatch = await bcrypt.compare(user_password, user.rows[0].user_password);
 
     if (!passwordMatch) {
       return res.status(401).json({ error: 'Authentication failed' });
     }
 
     const token = jwt.sign({ userId: user.rows[0].id, isAdmin: user.rows[0].is_admin }, 'your-secret-key', { expiresIn: '1h' });
 
     res.status(200).json({ message: 'Authentication successful', token });
   } catch (error) {
     console.error('Error authenticating user:', error);
     res.status(500).json({ error: 'Internal server error' });
   }
 }
 
 module.exports = {
   register,
   login,
 };