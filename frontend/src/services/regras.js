import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 30000
});

export async function listarRegras() {
  const { data } = await api.get('/regras');
  return data;
}
