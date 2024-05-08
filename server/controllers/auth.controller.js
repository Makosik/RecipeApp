const { register, login } = require('../models/auth');

async function handleRegister(req, res) {
   try {
      const result = await register(req.body);
      res.status(201).json(result);
   } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ error: 'Internal server error' });
   }
}

async function handleLogin(req, res) {
   try {
      const result = await login(req.body);
      res.status(200).json(result);
   } catch (error) {
      console.error('Error authenticating user:', error);
      res.status(500).json({ error: 'Internal server error' });
   }
}

module.exports = {
   handleRegister,
   handleLogin,
};
