import axios from 'axios';
import eventEmitter from '../utils/event-emitter';

// Set default credentials for all requests
axios.defaults.withCredentials = true;

// Add a response interceptor
axios.interceptors.response.use(
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
    // Do something with response error
    return Promise.reject(error);
  }
);

export default axios;
