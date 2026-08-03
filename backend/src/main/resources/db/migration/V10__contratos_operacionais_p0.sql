-- Impede dois ciclos ativos para o mesmo contrato do cliente.
create unique index if not exists uk_cobranca_ciclo_ativo_contrato
    on cobrancas (cpf_agregador, contrato_referencia)
    where status in ('ABERTA', 'EM_ANDAMENTO');

-- Índices das consultas usadas por Minha Fila, tarefas e Cliente 360.
create index if not exists idx_cobranca_fila_operacional
    on cobrancas (responsavel_identificador, status, prioridade, atualizada_em);
create index if not exists idx_cobranca_cliente_criacao
    on cobrancas (cpf_agregador, criada_em desc);
create index if not exists idx_cobranca_estado_sla
    on cobrancas (estado_fluxo, estado_fluxo_desde);
create index if not exists idx_tarefa_responsavel_status_prazo
    on tarefas_cobranca (responsavel_identificador, status, prazo_em);
create index if not exists idx_timeline_processo_data
    on processo_timeline (cobranca_id, criado_em, id);
create index if not exists idx_atendimento_processo_data
    on atendimentos (cobranca_id, realizado_em desc);
