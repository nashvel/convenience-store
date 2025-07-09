import axios from 'axios';
import eventEmitter from '../utils/event-emitter';

// Create a dedicated instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
  withCredentials: true,
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor from the original file
api.interceptors.response.use(
  (response) => {
    // Check for the custom notification header
    const notificationEvent = response.headers['x-notification-event'];
    if (notificationEvent) {
      // Dispatch the event using the event emitter
      eventEmitter.dispatch(notificationEvent);
    }
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors for session expiration
    if (error.response && error.response.status === 401) {
      console.error('Session expired or token is invalid. Logging out.');
      
      // Clear user data from storage
      localStorage.removeItem('user');
      localStorage.removeItem('token');

      // Redirect to the login page, unless we're already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login?session_expired=true';
      }
    }

    // Also check for notification headers on error responses
    if (error.response && error.response.headers['x-notification-event']) {
      eventEmitter.dispatch(error.response.headers['x-notification-event']);
    }

    return Promise.reject(error);
  }
);

export default api;
