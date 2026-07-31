alter table sincronizacoes_rbx_execucoes
    add column if not exists chave_idempotencia varchar(120),
    add column if not exists resultado_json text;

create unique index if not exists uk_sincronizacao_rbx_idempotencia
    on sincronizacoes_rbx_execucoes (chave_idempotencia)
    where chave_idempotencia is not null and status = 'SUCESSO';
