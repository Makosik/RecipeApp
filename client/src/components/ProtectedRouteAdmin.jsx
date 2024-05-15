import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedRouteAdmin = ({ children, isAdmin, isLoggedIn }) => {
   const navigate = useNavigate();
   useEffect(() => {
      if (!isLoggedIn || !isAdmin) {
         navigate('/');
      }
    }, [isLoggedIn, isAdmin]);  

   return children;
};

export default ProtectedRouteAdmin;