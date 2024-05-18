const db = require("./db");

const getOrders =  async () => {
   const orders = await db.query(
      `SELECT
      o.id AS order_id,
      o.user_id as user_id,
      o.dish_title,
      o.description AS order_description,
      TO_CHAR(o.created_at, 'DD.MM.YYYY HH24:MI') AS created_at,
      ARRAY_AGG(DISTINCT i.title) AS ingredients,
      ARRAY_AGG(DISTINCT i.id) AS ingredient_id,
      ARRAY_AGG(DISTINCT s.step_number) AS step_numbers,
      ARRAY_AGG(DISTINCT s.step_description) AS step_descriptions,
      ARRAY_AGG(DISTINCT s.file_path) AS file_path
  FROM orders o
  JOIN LATERAL unnest(o.ingredient_id) AS ing_id ON true
  JOIN ingredients i ON i.id = ing_id
  LEFT JOIN LATERAL (
      SELECT
          step_number,
          step_description,
          file_path
      FROM stepsForOrders s
      WHERE s.order_id = o.id
  ) s ON true
  WHERE o.is_deleted = FALSE
  GROUP BY o.id, o.user_id, o.dish_title, o.description, created_at
  ORDER BY o.id;
  `)
  return orders;
}

const getOrderById = async (orderId) => {
   const order = await db.query(
      `SELECT
      o.id AS order_id,
      o.user_id as user_id,
      o.dish_title,
      o.description AS order_description,
      TO_CHAR(o.created_at, 'DD.MM.YYYY HH24:MI') AS created_at,
      ARRAY_AGG(DISTINCT i.title) AS ingredients,
      ARRAY_AGG(DISTINCT i.id) AS ingredient_id,
      ARRAY_AGG(DISTINCT s.step_number) AS step_numbers,
      ARRAY_AGG(DISTINCT s.step_description) AS step_descriptions,
      ARRAY_AGG(DISTINCT s.file_path) AS file_path
  FROM orders o
  JOIN LATERAL unnest(o.ingredient_id) AS ing_id ON true
  JOIN ingredients i ON i.id = ing_id
  LEFT JOIN LATERAL (
      SELECT
          step_number,
          step_description,
          file_path
      FROM stepsForOrders s
      WHERE s.order_id = o.id
  ) s ON true
  WHERE o.id = $1 AND o.is_deleted = FALSE
  GROUP BY o.id, o.user_id, o.dish_title, o.description, created_at
  ORDER BY o.id;
  `, [orderId]);
  
  return order.rows[0]; // assuming the result contains only one order
}


const deleteOrder = async (order) => {
   const { order_id } = order;
   return await db.query('UPDATE orders SET is_deleted = true WHERE id = $1', [order_id]);
}

const addOrder = async (order) => {
      const { dish_title, ingredient_id, order_id, user_id } = order;
      const dishResult = await db.query('INSERT INTO Dishes (title, order_id, user_id) VALUES ($1, $2, $3) RETURNING id', [dish_title, order_id, user_id]);
      const dish_id = dishResult.rows[0].id;
      const insertIngredients = ingredient_id.map(ingredient_id => {
         return db.query('INSERT INTO Dishes_Ingredients (dish_id, ingredient_id) VALUES ($1, $2)', [dish_id, ingredient_id]);
      });
      await Promise.all(insertIngredients);
}

module.exports = {
   getOrders,
   deleteOrder,
   addOrder,
   getOrderById,
};