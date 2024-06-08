import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../style/Users.css';
import Navigation from '../components/Navigation';
import {
   getAccessToken,
   isTokenExpired,
   refreshAccessToken
 } from '../utils/authUtils';

const Users = () => {
   const [users, setUsers] = useState([]);
   const [accessToken, setAccessTokenState] = useState(getAccessToken());

   useEffect(() => {
      const fetchData = async () => {
        if (accessToken && isTokenExpired(accessToken)) {
          const newAccessToken = await refreshAccessToken();
          setAccessTokenState(newAccessToken);
        }
        fetchUsers(accessToken || getAccessToken());
      };
      fetchData();
    }, [accessToken]);

   const fetchUsers = async (currentToken) => {
      try {
         const config = {
            headers: {
               'Authorization': `Bearer ${currentToken}`
            }
         };
         const response = await axios.get('/api/users', config);
         setUsers(response.data.rows);
      } catch (error) {
         console.error('Ошибка при получении данных пользователей:', error);
      }
   };

   const handleDeleteUser = async (userId) => {
      try {
         const token = getAccessToken();
         const config = {
            headers: {
               'Authorization': `Bearer ${token}`
            }
         };
         await axios.delete(`/api/users/${userId}`, config);
         setUsers(users.filter(user => user.id !== userId));
         alert('Пользователь успешно удален')
         console.log('Пользователь успешно удален');
      } catch (error) {
         console.error('Ошибка при удалении пользователя:', error);
      }
   };

   return (
      <div>
         <Navigation />
         <div className='wrapper-user'>
            <h1>Список пользователей</h1>
            <table>
               <thead>
                  <tr>
                     <th>ID</th>
                     <th>Имя пользователя</th>
                     <th>Почта</th>
                     <th>Пароль</th>
                     <th></th>
                  </tr>
               </thead>
               <tbody>
                  {users.map((user) => (
                     <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.user_name}</td>
                        <td>{user.mail}</td>
                        <td>{user.user_password}</td>
                        <td>
                           <button
                              className="delete-button"
                              onClick={() => handleDeleteUser(user.id)}
                           >
                           </button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
   );
};

export default Users;
