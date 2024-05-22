import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginModal from './LoginModal';
import '../style/ProtectedRouteUser.css'

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
         <div className='ProtectedWrap'>
            {showModal && <LoginModal onClose={handleCloseModal} />}
         </div>
      );
   }

   return children;
};

export default ProtectedRouteUser;
