import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 120000
});

export async function listarCobrancasAbertas() {
  const { data } = await api.get('/cobrancas/abertas');
  return data;
}

export async function buscarCobrancasParaAtendimento({ pagina = 0, tamanho = 30, busca = '' } = {}) {
  const { data } = await api.get('/cobrancas/atendimento', { params: { pagina, tamanho, busca } });
  return data;
}

export async function sincronizarCobrancasRbx() {
  const { data } = await api.post('/cobrancas/sincronizar-rbx');
  return data;
}

export async function listarSincronizacoesRbx() {
  const { data } = await api.get('/cobrancas/sincronizacoes-rbx');
  return data;
}

export async function buscarProtocolosDoCliente(cpf) {
  const { data } = await api.get(`/cobrancas/clientes/${encodeURIComponent(cpf)}/protocolos`);
  return data;
}

export async function listarMinhaFila(responsavelIdentificador) {
  const { data } = await api.get(`/cobrancas/fila/${encodeURIComponent(responsavelIdentificador)}`);
  return data;
}

export async function distribuirFila(payload) {
  const { data } = await api.post('/cobrancas/fila/distribuir', payload);
  return data;
}

export async function listarTarefas(responsavelIdentificador) {
  const { data } = await api.get('/cobrancas/tarefas', { params: { responsavelIdentificador } });
  return data;
}

export async function atualizarTarefa(id, status) {
  const { data } = await api.put(`/cobrancas/tarefas/${id}`, { status });
  return data;
}

export async function listarPromessas(referencia) {
  const { data } = await api.get(`/cobrancas/${encodeURIComponent(referencia)}/promessas`);
  return data;
}

export async function registrarPromessa(referencia, payload) {
  const { data } = await api.post(`/cobrancas/${encodeURIComponent(referencia)}/promessas`, payload);
  return data;
}

export async function registrarPagamento(referencia, payload) {
  const { data } = await api.post(`/cobrancas/${encodeURIComponent(referencia)}/pagamentos`, payload);
  return data;
}

export async function registrarEstorno(referencia, payload) {
  const { data } = await api.post(`/cobrancas/${encodeURIComponent(referencia)}/estornos`, payload);
  return data;
}

export async function listarFaixasAtraso() {
  const { data } = await api.get('/cobrancas/configuracoes/faixas');
  return data;
}

export async function salvarFaixasAtraso(faixas) {
  const { data } = await api.put('/cobrancas/configuracoes/faixas', faixas);
  return data;
}

export async function consultarConfiguracaoSincronizacao() {
  const { data } = await api.get('/cobrancas/configuracoes/sincronizacao');
  return data;
}

export async function salvarConfiguracaoSincronizacao(configuracao) {
  const { data } = await api.put('/cobrancas/configuracoes/sincronizacao', configuracao);
  return data;
}
