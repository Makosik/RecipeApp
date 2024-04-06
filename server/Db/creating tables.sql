CREATE TABLE Ingredients (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) UNIQUE NOT NULL
);

drop table Ingredients CASCADE;

select * from ingredients;

CREATE TABLE Dishes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
	description VARCHAR(255)
);


drop table Dishes CASCADE;

select * from Dishes;

CREATE TABLE Dishes_Ingredients (
    dish_id INTEGER REFERENCES Dishes(id),
    ingredient_id INTEGER REFERENCES Ingredients(id),
    created_at_DI TIMESTAMP DEFAULT now(),
    PRIMARY KEY (dish_id, ingredient_id)
);

drop table Dishes_Ingredients CASCADE;

select * from Dishes_Ingredients;

SELECT
         Dishes.title AS dish_title,
         ARRAY_AGG(Ingredients.title) AS ingredient_titles,
         Dishes.description AS description
     FROM
         Dishes
     JOIN
         Dishes_Ingredients ON Dishes.id = Dishes_Ingredients.dish_id
     JOIN
         Ingredients ON Ingredients.id = Dishes_Ingredients.ingredient_id
     GROUP BY
         Dishes.title, Dishes.description
     ORDER BY
         MAX(Dishes_Ingredients.created_at_DI) DESC;


CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    user_name VARCHAR(255) NOT NULL,
	mail VARCHAR(255) NOT NULL,
	user_password VARCHAR(255) NOT NULL
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    dish_title VARCHAR(255) NOT NULL,
    ingredient_id INTEGER [],
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    description VARCHAR(255),
    cooking_steps JSONB []
);


drop TABLE orders CASCADE;

SELECT cooking_steps from orders;


SELECT
   o.id AS order_id,
   o.dish_title,
   TO_CHAR(o.created_at, 'DD.MM.YYYY HH24:MI') AS formatted_created_at,
   ARRAY_AGG(i.title) AS ingredients,
   ARRAY_AGG(i.id) AS ingredient_id
FROM orders o
JOIN LATERAL unnest(o.ingredient_id) AS ing_id ON true
JOIN ingredients i ON i.id = ing_id
GROUP BY o.id, o.dish_title, formatted_created_at
ORDER BY o.id;


SELECT
   o.id AS order_id,
   o.dish_title,
   o.description,
   TO_CHAR(o.created_at, 'DD.MM.YYYY HH24:MI') AS created_at,
   ARRAY_AGG(i.title) AS ingredients,
   ARRAY_AGG(i.id) AS ingredient_id,
   COALESCE(jsonb_agg(cs.step) FILTER (WHERE cs.step IS NOT NULL), '[]'::jsonb) AS cooking_steps
FROM orders o
JOIN LATERAL unnest(o.ingredient_id) AS ing_id ON true
JOIN ingredients i ON i.id = ing_id
LEFT JOIN LATERAL jsonb_array_elements_text(o.cooking_steps) AS cs(step) ON true
GROUP BY o.id, o.dish_title, o.description, o.created_at
ORDER BY o.id;

















