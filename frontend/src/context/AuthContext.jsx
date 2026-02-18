import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export { AuthContext };
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const res = await axios.get(`${API_URL}/api/auth/profile`);
      setUser(res.data.user);
    } catch (error) {
      console.error('Error fetching profile:', error);
      localStorage.removeItem('token');
    }
    setLoading(false);
  };

  const login = async (username, password) => {
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';
    const res = await axios.post(`${API_URL}/api/auth/login`, {
      username,
      password
    });
    const { token, user } = res.data;
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(user);
    return user;
  };

  const register = async (userData) => {
    try {
      console.log('Sending registration request with data:', {
        username: userData.username
      });

      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';
      const res = await axios.post(`${API_URL}/api/auth/register`, {
        username: userData.username,
        password: userData.password
      });

      console.log('Registration response:', res.data);

      if (res.data.success) {
        const { token, user } = res.data;
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(user);
        return user;
      } else {
        throw new Error(res.data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Error during registration:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Server error during registration');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};