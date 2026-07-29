import { api } from './api';
export async function listarPoliticasLgpd() {
  const { data } = await api.get('/lgpd/politicas');
  return data;
}
export async function atualizarPoliticaLgpd(politica) {
  const { data } = await api.put(`/lgpd/politicas/${politica.id}`, politica);
  return data;
}
export async function exportarDadosTitular(dados) {
  const { data } = await api.post('/lgpd/titulares/exportar', dados);
  return data;
}
export async function anonimizarTitular(dados) {
  const { data } = await api.post('/lgpd/titulares/anonimizar', dados);
  return data;
}
