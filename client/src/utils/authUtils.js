import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

export const getAccessToken = () => localStorage.getItem('accessToken');
export const getRefreshToken = () => localStorage.getItem('refreshToken');

export const setAccessToken = (token) => localStorage.setItem('accessToken', token);

export const isTokenExpired = (token) => {
  const decodedToken = jwtDecode(token);
  const currentTime = Date.now() / 1000;
  return decodedToken.exp < currentTime;
};

export const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  try {
    const response = await axios.post('/api/refresh-token', { token: refreshToken });
    const newAccessToken = response.data.accessToken;
    setAccessToken(newAccessToken);
    return newAccessToken;
  } catch (error) {
    console.error('Error refreshing access token', error);
    throw new Error('Ошибка обновления токена доступа');
  }
};
