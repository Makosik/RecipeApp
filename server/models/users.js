const db = require("./db");

const getUsers = async () => {
   return await db.query(`Select * from users;`);
}

const deleteUsers = async (id) => {
   const {userId} = id;
   return await db.query(`DELETE FROM users WHERE id = $1;`, [userId]);
}

module.exports = {
   getUsers,
   deleteUsers,
}