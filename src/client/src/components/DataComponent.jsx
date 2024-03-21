import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DataComponent = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get('/api/dishes');
      setData(result.data);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Data from PostgreSQL</h1>
      <ul>
        {data.map(item => (
          <li key={item.id}>{item.title}</li> // Replace 'columnName' with actual column name
        ))}
      </ul>
    </div>
  );
};

export default DataComponent;