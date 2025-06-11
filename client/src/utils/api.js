import axios from 'axios';

const baseURL = process.env.NODE_ENV === 'production'
  ? 'https://drunkdragon.vercel.app'
  : 'http://localhost:5173';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
