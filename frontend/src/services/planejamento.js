import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api', timeout: 30000 });

export async function consultarMetricas(competencia) {
  const { data } = await api.get('/planejamento/metricas', { params: { competencia } });
  return data;
}
export async function listarBacklog() {
  const { data } = await api.get('/planejamento/backlog');
  return data;
}
export async function atualizarBacklog(item) {
  const { data } = await api.put(`/planejamento/backlog/${item.id}`, item);
  return data;
}
