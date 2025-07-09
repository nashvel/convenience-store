import api from './axios-config';

export const fetchStores = () => {
  return api.get('/stores');
};
