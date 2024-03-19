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







