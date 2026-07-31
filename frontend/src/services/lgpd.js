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
export async function listarIncidentes() { const { data } = await api.get('/lgpd/incidentes'); return data; }
export async function criarIncidente(dados) { const { data } = await api.post('/lgpd/incidentes', dados); return data; }
export async function atualizarIncidente(dados) { const { data } = await api.put(`/lgpd/incidentes/${dados.id}`, dados); return data; }
export async function listarExecucoesRetencao() { const { data } = await api.get('/lgpd/retencao/execucoes'); return data; }
export async function executarRetencao(simulacao = true) { const { data } = await api.post(`/lgpd/retencao/executar?simulacao=${simulacao}`); return data; }
