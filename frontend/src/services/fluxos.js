import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api', timeout: 30000 });

export async function listarFluxos() {
  const { data } = await api.get('/fluxos');
  return data;
}
export async function criarFluxo(dados) {
  const { data } = await api.post('/fluxos', dados);
  return data;
}
export async function editarFluxo(id, dados) {
  const { data } = await api.put(`/fluxos/${id}`, dados);
  return data;
}
export async function consultarEstadoProcesso(referencia) {
  const { data } = await api.get(`/fluxos/processos/${encodeURIComponent(referencia)}`);
  return data;
}
export async function alterarEstadoProcesso(referencia, dados) {
  const { data } = await api.post(`/fluxos/processos/${encodeURIComponent(referencia)}/transicoes`, dados);
  return data;
}
export async function alterarEstadoProcessosEmLote(dados) {
  const { data } = await api.post('/fluxos/processos/transicoes-lote', dados);
  return data;
}
export async function atribuirFluxoProcesso(referencia, dados) {
  const { data } = await api.put(`/fluxos/processos/${encodeURIComponent(referencia)}`, dados);
  return data;
}
