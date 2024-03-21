import React, { useState } from 'react';
import axios from 'axios';

const AddDishForm = () => {
  const [title, setTitle] = useState('');

  const handleInputChange = (e) => {
    setTitle(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/dish', { title });
      alert('Блюдо успешно добавлено!');
    } catch (error) {
      console.error('Ошибка при добавлении блюда:', error);
      alert('Ошибка при добавлении блюда!');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Название блюда:
        <input type="text" value={title} onChange={handleInputChange} />
      </label>
      <button type="submit">Добавить блюдо</button>
    </form>
  );
};

export default AddDishForm;
