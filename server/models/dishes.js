const db = require("./db");

const getDishes =  async () => {

  return await db.query(
      `SELECT
      Dishes.id AS dish_id,
      Dishes.title AS dish_title,
      ARRAY_AGG(DISTINCT Ingredients.title) AS ingredient_titles,
      orders.description AS description,
      ARRAY_AGG(DISTINCT stepsForOrders.step_number) AS step_numbers,
      ARRAY_AGG(DISTINCT stepsForOrders.step_description) AS step_descriptions,
      ARRAY_AGG(DISTINCT stepsForOrders.file_path) AS file_path
  FROM
      orders
  JOIN
       dishes ON dishes.order_id = orders.id 
  JOIN
      Dishes_Ingredients ON Dishes.id = Dishes_Ingredients.dish_id
  JOIN
      Ingredients ON Ingredients.id = Dishes_Ingredients.ingredient_id
  LEFT JOIN
      stepsForOrders ON Dishes.order_id = stepsForOrders.order_id
  GROUP BY
   Dishes.id, Dishes.title, orders.description
  ORDER BY
      MAX(Dishes_Ingredients.created_at_DI) DESC;
  `)
   
}

const getIngredients = async () => {
   return await db.query(`select * from Ingredients;`)
}

const deleteDish = async (dish) => {
   const { dish_id } = dish;
   return await db.query('DELETE from dishes where id = $1', [dish_id]);
}

const createDish = async (dish) => {
   const { dish_title, ingredient_id, description, cookingSteps, uploadedFilesPaths } = dish;
   console.log('photoUplload: ', uploadedFilesPaths)
      const result = await db.query('INSERT INTO orders (dish_title, ingredient_id, description) VALUES ($1, $2, $3) RETURNING id', [dish_title, ingredient_id, description]);
      const orderId = result.rows[0].id;

      for (const [index, step] of cookingSteps.entries()) {
         const stepData = [orderId, step.step_number, step.step_description, uploadedFilesPaths[index]];
         console.log('stepData: ', stepData)
         await db.query('INSERT INTO stepsForOrders (order_id, step_number, step_description, file_path) VALUES ($1, $2, $3, $4)', stepData);
      }

   }

   module.exports ={
      getDishes,
      getIngredients,
      deleteDish,
      createDish,
   };