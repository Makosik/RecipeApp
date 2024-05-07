CREATE TABLE Ingredients (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) UNIQUE NOT NULL
);

drop table Ingredients CASCADE;

select * from ingredients;

CREATE TABLE Dishes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
	order_id integer REFERENCES orders(id)
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
         ARRAY_AGG(DISTINCT Ingredients.title) AS ingredient_titles,
         orders.description AS description,
         ARRAY_AGG(DISTINCT stepsForDishes.step_number) AS step_numbers,
         ARRAY_AGG(DISTINCT stepsForDishes.step_description) AS step_descriptions
     FROM
         orders
     JOIN
	 	   dishes ON dishes.order_id = orders.id 
     JOIN
         Dishes_Ingredients ON Dishes.id = Dishes_Ingredients.dish_id
     JOIN
         Ingredients ON Ingredients.id = Dishes_Ingredients.ingredient_id
     LEFT JOIN
         stepsForDishes ON Dishes.id = stepsForDishes.dish_id
     GROUP BY
         Dishes.title, orders.description
     ORDER BY
         MAX(Dishes_Ingredients.created_at_DI) DESC;


CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    user_name VARCHAR(255) NOT NULL,
	mail VARCHAR(255) UNIQUE NOT NULL,
	user_password VARCHAR(255) NOT NULL,
	is_admin boolean DEFAULT false
);

drop table users CASCADE;

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    dish_title VARCHAR(255) NOT NULL,
    ingredient_id INTEGER [],
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    description VARCHAR(255),
	is_deleted boolean DEFAULT false
);

drop TABLE orders CASCADE;

SELECT * from orders;


CREATE TABLE stepsForOrders (
    step_id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    step_number INTEGER NOT NULL,
    step_description TEXT,
	file_path VARCHAR(255) NOT NULL
);

drop TABLE stepsForOrders CASCADE;

SELECT * from stepsForOrders;


-- CREATE TABLE photoForSteps (
--     id SERIAL PRIMARY KEY,
--     id_stepsForOrders INTEGER REFERENCES stepsForOrders(step_id),
--     path_img VARCHAR(255) NOT NULL
-- );

-- drop TABLE photoForSteps CASCADE;

-- SELECT * from photoForSteps;







