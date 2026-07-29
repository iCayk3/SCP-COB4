import { api } from './api';

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
export async function listarFechamentos(competencia) {
  const { data } = await api.get('/planejamento/fechamentos', { params: { competencia } });
  return data;
}
export async function gerarFechamento({ competencia, usuario = 'Sistema', observacao = '' }) {
  const { data } = await api.post('/planejamento/fechamentos', null, {
    params: { competencia, usuario, observacao }
  });
  return data;
}
export async function aprovarFechamento(id) {
  const { data } = await api.post(`/planejamento/fechamentos/${id}/aprovar`);
  return data;
}
export async function cancelarFechamento(id, motivo = '') {
  const { data } = await api.post(`/planejamento/fechamentos/${id}/cancelar`, null, { params: { motivo } });
  return data;
}
