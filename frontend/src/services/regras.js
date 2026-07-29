import { api } from './api';

export async function listarRegras() {
  const { data } = await api.get('/regras');
  return data;
}
