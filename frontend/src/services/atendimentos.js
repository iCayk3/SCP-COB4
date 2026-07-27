import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 30000
});

export async function registrarAtendimento(referencia, dados) {
  const { data } = await api.post(`/processos/${encodeURIComponent(referencia)}/atendimentos`, dados);
  return data;
}

export async function listarAtendimentos(referencia) {
  const { data } = await api.get(`/processos/${encodeURIComponent(referencia)}/atendimentos`);
  return data;
}

export async function listarTimeline(referencia) {
  const { data } = await api.get(`/processos/${encodeURIComponent(referencia)}/timeline`);
  return data;
}

export async function gerarSimulacoesAtendimento() {
  const { data } = await api.post('/atendimentos/simulacoes');
  return data;
}
