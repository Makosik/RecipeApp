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
// pool.query( `
// SELECT Dishes.title AS dish_title, 
//        ARRAY_AGG(Ingredients.title) AS ingredient_titles
// FROM Dishes
// JOIN Dishes_Ingredients ON Dishes.id = Dishes_Ingredients.dish_id
// JOIN Ingredients ON Ingredients.id = Dishes_Ingredients.ingredient_id
// GROUP BY Dishes.title;`,
//  (err, result) => {
//    if (err) {
//       console.error('Ошибка выполнения запроса:', err);
//    } else {
//       console.log('Результат запроса:', result.rows);
//    }
// });

module.exports = pool;