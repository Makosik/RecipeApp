const db = require("./db");

const getFavorites = async (userId) => {
   return await db.query(`
      SELECT
          Dishes.id AS dish_id,
          Dishes.user_id as user_id,
          Dishes.title AS dish_title,
          orders.coverphoto_path AS coverPhoto,
          ARRAY_AGG(DISTINCT Ingredients.title) AS ingredient_titles,
          orders.description AS description,
          ARRAY_AGG(DISTINCT stepsForOrders.step_number) AS step_numbers,
          ARRAY_AGG(DISTINCT stepsForOrders.step_description) AS step_descriptions,
          ARRAY_AGG(DISTINCT stepsForOrders.file_path) AS file_path
      FROM
          favorites
      JOIN
          Dishes ON favorites.dish_id = Dishes.id
      JOIN
          orders ON Dishes.order_id = orders.id
      JOIN
          Dishes_Ingredients ON Dishes.id = Dishes_Ingredients.dish_id
      JOIN
          users ON Dishes.user_id = users.id
      JOIN
          Ingredients ON Ingredients.id = Dishes_Ingredients.ingredient_id
      LEFT JOIN
          stepsForOrders ON Dishes.order_id = stepsForOrders.order_id
      WHERE
          favorites.user_id = $1
      GROUP BY
          Dishes.id, Dishes.user_id, Dishes.title, orders.coverphoto_path, orders.description
      ORDER BY
          MAX(Dishes_Ingredients.created_at_DI) DESC;
   `, [userId]);
}


const deleteFavorite = async (fav) => {
   const { userId, dish_id } = fav;
   return await db.query('delete from favorites WHERE user_id =$1 and dish_id = $2', [userId, dish_id]);
}

const addFavorite = async (fav) => {
   const { userId, dish_id} = fav;
   return db.query('INSERT INTO favorites (user_id, dish_id) VALUES ($1, $2)', [userId, dish_id]);
}

module.exports = {
   getFavorites,
   deleteFavorite,
   addFavorite,
};