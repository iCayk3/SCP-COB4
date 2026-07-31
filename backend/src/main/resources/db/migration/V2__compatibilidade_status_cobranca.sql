alter table cobrancas drop constraint if exists cobrancas_status_check;
alter table cobrancas
    add constraint cobrancas_status_check
    check (status in ('ABERTA', 'EM_ANDAMENTO', 'ENCERRADA', 'PAGA', 'CANCELADA'));
