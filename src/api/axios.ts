import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // Change to your Rails backend URL/port
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export default api;
