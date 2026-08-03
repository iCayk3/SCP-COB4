-- Execute em modo somente leitura antes de aplicar a V10.
-- Resultado vazio = apto para criar uk_cobranca_ciclo_ativo_contrato.
-- Qualquer linha deve ser conciliada ou encerrada antes da migration.
select cpf_agregador,
       contrato_referencia,
       count(*) as processos_ativos,
       string_agg(referencia, ', ' order by criada_em) as referencias
  from cobrancas
 where status in ('ABERTA', 'EM_ANDAMENTO')
   and cpf_agregador is not null
   and contrato_referencia is not null
 group by cpf_agregador, contrato_referencia
having count(*) > 1
 order by processos_ativos desc, cpf_agregador, contrato_referencia;
