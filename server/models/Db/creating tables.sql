CREATE TABLE Ingredients (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) UNIQUE NOT NULL
);

drop table Ingredients CASCADE;

select * from ingredients;


CREATE TABLE Dishes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
	order_id integer REFERENCES orders(id),
	user_id integer REFERENCES users(id)
);


drop table Dishes CASCADE;

select * from Dishes;

CREATE TABLE Dishes_Ingredients (
    dish_id INTEGER REFERENCES Dishes(id) ON DELETE CASCADE,
    ingredient_id INTEGER REFERENCES Ingredients(id),
    created_at_DI TIMESTAMP DEFAULT now(),
    PRIMARY KEY (dish_id, ingredient_id)
);

drop table Dishes_Ingredients CASCADE;

select * from Dishes_Ingredients;


CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    user_name VARCHAR(255) NOT NULL,
	mail VARCHAR(255) UNIQUE NOT NULL,
	user_password VARCHAR(255) NOT NULL,
	is_admin boolean DEFAULT false
);


drop table users CASCADE;

SELECT * from users;


CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    dish_title VARCHAR(255) NOT NULL,
    ingredient_id INTEGER [],
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    description VARCHAR(255),
	is_deleted boolean DEFAULT false,
	user_id INTEGER  REFERENCES users(id)
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


CREATE TABLE favorites (
    user_id INTEGER REFERENCES users(id),
    dish_id INTEGER REFERENCES Dishes(id),
    PRIMARY KEY (user_id, dish_id)
);



