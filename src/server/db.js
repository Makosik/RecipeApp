const { Pool } = require('pg');

// Конфигурация базы данных PostgreSQL
const pool = new Pool({
   user: 'postgres', // Пользователь базы данных
   host: 'localhost', // Хост базы данных (обычно localhost)
   database: 'Recipe', // Название базы данных, которую мы создали
   password: 'admin', // Пароль пользователя postgres
   port: 5432, // Порт PostgreSQL (по умолчанию 5432)
});

// Простой запрос к базе данных для проверки
// pool.query('SELECT * from Dishes', (err, result) => {
//    if (err) {
//       console.error('Ошибка выполнения запроса:', err);
//    } else {
//       console.log('Результат запроса:', result.rows);
//    }
// });

module.exports = pool;