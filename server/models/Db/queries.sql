CREATE TABLE Ingredients (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) UNIQUE NOT NULL
);

drop table Ingredients CASCADE;

select * from ingredients;


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

drop TABLE favorites CASCADE;

SELECT * from favorites;


INSERT INTO Ingredients (title)
VALUES
('Мясо говядины'),
('Мясо курицы'),
('Рыба'),
('Помидоры'),
('Огурцы'),
('Перец болгарский'),
('Лук'),
('Чеснок'),
('Картофель'),
('Морковь'),
('Сахар'),
('Мука'),
('Рис'),
('Соль'),
('Перец'),
('Масло растительное'),
('Масло оливковое'),
('Сметана'),
('Сыр'),
('Молоко'),
('Сливки'),
('Яйца'),
('Зелень'),
('Грибы'),
('Специи'),
('Уксус'),
('Сода'),
('Майонез'),
('Кетчуп'),
('Горчица'),
('Соевый соус'),
('Маслины'),
('Лимон'),
('Мед'),
('Сухие фрукты'),
('Орехи'),
('Шоколад'),
('Какао порошок'),
('Кофе'),
('Чай'),
('Вода'),
('Сок'),
('Вино'),
('Пиво'),
('Апельсины'),
('Яблоки'),
('Груши'),
('Вишня'),
('Ананасы'),
('Клубника'),
('Малина'),
('Абрикосы'),
('Персики'),
('Арбуз'),
('Дыня'),
('Киви'),
('Бананы'),
('Мандарины'),
('Грейпфруты'),
('Лайм'),
('Мята'),
('Кинза'),
('Петрушка'),
('Розмарин'),
('Тимьян'),
('Базилик'),
('Кориандр'),
('Имбирь'),
('Куркума'),
('Корица'),
('Ваниль'),
('Карри'),
('Паприка'),
('Хрен'),
('Тмин'),
('Марсала'),
('Бренди'),
('Кальвадос'),
('Виски'),
('Текила'),
('Ром'),
('Водка'),
('Шампанское'),
('Коньяк'),
('Ликер'),
('Вермут'),
('Кока-кола'),
('Пепси-кола'),
('Спрайт'),
('Фанта'),
('Сока'),
('Лимонад'),
('Лук-порей'),
('Сельдерей'),
('Перец чили'),
('Корень имбиря'),
('Лимонная трава'),
('Кокосовое молоко'),
('Кунжутное масло'),
('Лавровый лист'),
('Редис'),
('Фасоль'),
('Чечевица'),
('Баклажаны'),
('Спаржа'),
('Шпинат'),
('Капуста'),
('Брокколи'),
('Цукини'),
('Кабачок'),
('Белокочанная капуста'),
('Щавель'),
('Руккола'),
('Морская капуста'),
('Консервированные помидоры'),
('Артишоки'),
('Оливки'),
('Каперсы'),
('Лимонный сок'),
('Лаймовый сок'),
('Грейпфрутовый сок'),
('Апельсиновый сок'),
('Ананасовый сок'),
('Вишневый сок'),
('Яблочный сок'),
('Гранатовый сок'),
('Малиновый сок'),
('Персиковый сок'),
('Грушевый сок'),
('Черничный сок'),
('Морковный сок'),
('Томатный сок'),
('Гранатовый сироп'),
('Розовый сироп'),
('Мятный сироп'),
('Френч-ванильный сироп'),
('Карамельный сироп'),
('Имбирный сироп'),
('Апельсиновый сироп'),
('Лимонный сироп'),
('Малиновый сироп'),
('Вишневый сироп'),
('Кокосовый сироп'),
('Масло кунжутное'),
('Масло арахисовое'),
('Масло из виноградных косточек'),
('Масло авокадо'),
('Масло грецкого ореха'),
('Масло миндаля'),
('Масло льняное'),
('Масло тыквенное'),
('Масло ореха макадамии'),
('Масло кедрового ореха'),
('Масло кешью'),
('Масло маковое'),
('Масло подсолнечное'),
('Масло кокосовое'),
('Масло пальмовое'),
('Масло рапсовое'),
('Масло соевое'),
('Масло оливковое extra virgin'),
('Масло оливковое рафинированное'),
('Масло оливковое грубого отжима'),
('Масло кукурузное'),
('Курица'),
('Свинина'),
('Говядина'),
('Лосось'),
('Индейка'),
('Свекла'),
('Томаты'), 
('Кабачки'),
('Цветная капуста'), 
('Салатный лист'),
('Редька'), 
('Укроп'),
('Салат Романо'), 
('Латук'), 
('Брюссельская капуста'),
('Картофель сладкий'), 
('Морковь цветная'), 
('Тыква'), 
('Кабачки цветные'), 
('Баклажаны цветные'), 
('Черри'), 
('Томаты желтые'), 
('Томаты черри'),
('Томаты груша'), 
('Томаты черного цвета'), 
('Томаты кумато'), 
('Брокколетти'), 
('Мини кабачки'), 
('Мини перцы'),
('Пекинская капуста'),
('Картофель новый'),
('Колбаса');

