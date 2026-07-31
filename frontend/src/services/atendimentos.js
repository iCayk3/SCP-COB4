import { api } from './api';

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

export async function listarAnexos(referencia) {
  const { data } = await api.get(`/processos/${encodeURIComponent(referencia)}/anexos`);
  return data;
}
export async function enviarAnexo(referencia, arquivo, classificacao = 'OUTRO') {
  const form = new FormData(); form.append('arquivo', arquivo);
  const { data } = await api.post(`/processos/${encodeURIComponent(referencia)}/anexos`, form, { params: { classificacao } });
  return data;
}
export async function baixarAnexo(referencia, anexo) {
  const { data } = await api.get(`/processos/${encodeURIComponent(referencia)}/anexos/${anexo.id}`, { responseType: 'blob' });
  const url = URL.createObjectURL(data); const link = document.createElement('a');
  link.href = url; link.download = anexo.nome; link.click(); URL.revokeObjectURL(url);
}
export async function listarAgenda(referencia) {
  const { data } = await api.get(`/processos/${encodeURIComponent(referencia)}/agenda`); return data;
}
export async function criarAgendamento(referencia, payload) {
  const { data } = await api.post(`/processos/${encodeURIComponent(referencia)}/agenda`, payload); return data;
}
export async function atualizarAgendamento(referencia, id, status) {
  const { data } = await api.patch(`/processos/${encodeURIComponent(referencia)}/agenda/${id}`, null, { params: { status } }); return data;
}
export async function listarAtualizacoes(cpf) {
  const { data } = await api.get(`/clientes/${encodeURIComponent(cpf)}/atualizacoes`); return data;
}
export async function solicitarAtualizacao(cpf, payload) {
  const { data } = await api.post(`/clientes/${encodeURIComponent(cpf)}/atualizacoes`, payload); return data;
}
