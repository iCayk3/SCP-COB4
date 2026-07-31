import { api } from './api';

export async function consultarPoliticaFinanceira() {
  const { data } = await api.get('/configuracoes/politica-financeira');
  return data;
}

export async function listarHistoricoPoliticaFinanceira() {
  const { data } = await api.get('/configuracoes/politica-financeira/historico');
  return data;
}

export async function publicarPoliticaFinanceira(politica) {
  const { data } = await api.post('/configuracoes/politica-financeira/publicar', politica);
  return data;
}
