import React, { useRef, useEffect } from 'react';
import '../style/LoginModal.css';
import { Link } from 'react-router-dom';

const LoginModal = ({ onClose }) => {
  const modalRef = useRef(null);

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    document.body.classList.add('modal-open');
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.classList.remove('modal-open');
    };
  }, [onClose]);

  return (
    <div className="modal-overlay">
      <div className="modal" ref={modalRef}>
        <h2>Пожалуйста, войдите в систему, чтобы продолжить.</h2>
        <div>
          <Link to="/login"><button>Авторизоваться</button></Link>
          <Link to="/register"><button>Зарегистрироваться</button></Link>
        </div>
        <button className="close-button" onClick={onClose}>X</button>
      </div>
    </div>
  );
};

export default LoginModal;
