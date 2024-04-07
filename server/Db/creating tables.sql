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
    description VARCHAR(255)
);

drop TABLE orders CASCADE;

SELECT * from orders;


CREATE TABLE stepsForOrders (
    step_id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    step_number INTEGER NOT NULL,
    step_description TEXT
);

drop TABLE stepsForOrders CASCADE;

SELECT * from stepsForOrders;


CREATE TABLE stepsForDishes (
    step_id SERIAL PRIMARY KEY,
    dish_id INTEGER REFERENCES dishes(id),
    step_number INTEGER NOT NULL,
    step_description TEXT
);

drop TABLE stepsForDishes CASCADE;

SELECT * from stepsForDishes;

















