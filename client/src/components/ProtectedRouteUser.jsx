import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginModal from './LoginModal';

const ProtectedRouteUser = ({ children, isLoggedIn }) => {
   const navigate = useNavigate();
   const [showModal, setShowModal] = useState(false);

   useEffect(() => {
      if (!isLoggedIn) {
         setShowModal(true);
      }
   }, [isLoggedIn]);

   const handleCloseModal = () => {
      setShowModal(false);
      navigate(-1);
   };

   if (!isLoggedIn) {
      return (
         <>
            {showModal && <LoginModal onClose={handleCloseModal} />}
         </>
      );
   }

   return children;
};

export default ProtectedRouteUser;
