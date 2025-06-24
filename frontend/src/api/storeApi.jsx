import axios from 'axios';
import { API_BASE_URL } from '../config';

const API_URL = API_BASE_URL;

const apiClient = axios.create({
  withCredentials: true,
  baseURL: API_URL,
});

export const fetchStores = () => {
  return apiClient.get('/stores');
};
