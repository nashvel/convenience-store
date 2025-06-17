import axios from 'axios';

const API_URL = 'http://localhost:8080/api'; // Your CodeIgniter backend URL

const apiClient = axios.create({
  baseURL: API_URL,
});

export const fetchStores = () => {
  return apiClient.get('/stores');
};
