import axios from 'axios';
import { API_BASE_URL } from '../config';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add the auth token to every request
api.interceptors.request.use(
  (config) => {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        // Assuming the token is stored within the user object
        if (user && user.token) {
          config.headers['Authorization'] = `Bearer ${user.token}`;
        }
      } catch (error) {
        console.error('Failed to parse user from localStorage for API interceptor:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if the error is a 401 Unauthorized response
    if (error.response && error.response.status === 401) {
      console.error('Session expired or token is invalid. Logging out.');
      
      // Clear user data from storage
      localStorage.removeItem('user');
      localStorage.removeItem('token'); // Also remove standalone token just in case

      // Redirect to the login page
      // Adding a query parameter to potentially show a message on the login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login?session_expired=true';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
