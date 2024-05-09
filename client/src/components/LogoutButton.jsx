import { useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';

function LogoutButton() {
   const dispatch = useDispatch();
   const navigate = useNavigate();

   const handleLogout = () => {
      localStorage.removeItem('token');
      dispatch(logout());
      navigate('/login');
   };

   return (
      <button onClick={handleLogout}>Выход</button>
   );
}

export default LogoutButton;
