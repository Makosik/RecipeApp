const { deleteUsers, getUsers} = require("../models/users")

class UsersController {
   async getUsers(req, res) {
      try {
         const users = await getUsers();
         res.json(users);
      } catch (error) {
         console.error('Ошибка при получении пользователей:', error.message);
         res.status(500).json({ error: 'Ошибка при получении пользователей' });
      }
   }

   async deleteUsers(req, res) {
      const { userId } = req.params; 
      
      try {
         await deleteUsers({ userId })
         res.json({ success: true, message: 'Пользователь успешно удален' });
      } catch (error) {
         console.error('Ошибка при удалении пользователя:', error.message);
         res.status(500).json({ error: 'Ошибка при удалении пользователя' });
      }
   }

}

module.exports = new UsersController();