import React, { useState, useEffect } from 'react';
import Search from "./Search";
import axios from 'axios';

const DataComponent = () => {
   const [data, setData] = useState([]);
   const [search, setsearch] = useState("");

   useEffect(() => {
      const fetchData = async () => {
         const result = await axios.get('/api/dishes');
         setData(result.data);
      };

      fetchData();
   }, []);

   return (
      <div>
         <Search searchValue={setsearch} />
         <h1>Data from PostgreSQL</h1>
         <div>
            {data.map(item => (
               <div key={item.id}>{item.dish_title}
                  <ul>
                     {item.ingredient_titles.map(ingr => (
                        <li>{ingr}</li>
                     ))}
                  </ul>
               </div>
            ))}
         </div>
      </div>
   );
};

export default DataComponent;