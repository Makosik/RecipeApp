CREATE TABLE Ingredients (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) UNIQUE NOT NULL
);

drop table Ingredients CASCADE;

select * from ingredients;

CREATE TABLE Dishes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) UNIQUE NOT NULL
);

drop table Ingredients CASCADE;

select * from Dishes;

CREATE TABLE Dishes_Ingredients (
    dish_id INTEGER REFERENCES Dishes(id),
    ingredient_id INTEGER REFERENCES Ingredients(id),
    PRIMARY KEY (dish_id, ingredient_id)
);

drop table Ingredients CASCADE;

select * from Dishes_Ingredients;

SELECT Dishes.title AS dish_title, Ingredients.title AS ingredient_title
FROM Dishes
JOIN Dishes_Ingredients ON Dishes.id = Dishes_Ingredients.dish_id
join ingredients ON ingredients.id = Dishes_Ingredients.ingredient_id


CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    user_name VARCHAR(255) NOT NULL,
	mail VARCHAR(255) NOT NULL,
	user_password VARCHAR(255) NOT NULL
);


