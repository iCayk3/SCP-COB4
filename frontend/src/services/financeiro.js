import { api } from './api';
export async function simularAcordo(dados){const {data}=await api.post('/financeiro/acordos/simular',dados);return data;}
export async function criarAcordo(dados){const {data}=await api.post('/financeiro/acordos',dados);return data;}
export async function listarAcordos(cobrancaReferencia){const {data}=await api.get('/financeiro/acordos',{params:{cobrancaReferencia}});return data;}
export async function decidirAcordo(protocolo,aprovar,motivo){const {data}=await api.post(`/financeiro/acordos/${protocolo}/${aprovar?'aprovar':'rejeitar'}`,null,{params:{motivo}});return data;}
export async function ativarAcordo(protocolo){const {data}=await api.post(`/financeiro/acordos/${protocolo}/ativar`);return data;}
export async function registrarPagamentoFinanceiro(dados){const {data}=await api.post('/financeiro/pagamentos',dados);return data;}
export async function listarPagamentos(cobrancaReferencia){const {data}=await api.get('/financeiro/pagamentos',{params:{cobrancaReferencia}});return data;}
export async function confirmarPagamento(id){const {data}=await api.post(`/financeiro/pagamentos/${id}/confirmar`);return data;}
export async function estornarPagamento(id,motivo){const {data}=await api.post(`/financeiro/pagamentos/${id}/estornar`,null,{params:{motivo}});return data;}
export async function conciliarFinanceiro(){const {data}=await api.post('/financeiro/conciliacao');return data;}
export async function exportarFechamento(id,formato){const {data}=await api.get(`/planejamento/fechamentos/${id}/exportar/${formato}`,{responseType:'blob'});const url=URL.createObjectURL(data);const a=document.createElement('a');a.href=url;a.download=`fechamento-${id}.${formato}`;a.click();URL.revokeObjectURL(url);}
