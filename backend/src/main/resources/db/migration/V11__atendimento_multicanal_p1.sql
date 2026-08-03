alter table atendimentos drop constraint if exists atendimentos_canal_check;
alter table atendimentos add constraint atendimentos_canal_check check (canal in ('CHAT','WHATSAPP','TELEFONE','SMS','EMAIL','PRESENCIAL'));
alter table atendimentos add column if not exists duracao_segundos integer;
alter table atendimentos add column if not exists retorno_agendado_em timestamp with time zone;
alter table atendimentos add column if not exists promessa_id bigint;
alter table atendimentos add column if not exists acordo_id bigint;
alter table atendimentos add column if not exists agendamento_id bigint;
alter table atendimentos add constraint ck_atendimento_duracao check (duracao_segundos is null or duracao_segundos >= 0);
create index if not exists idx_atendimento_operador_data on atendimentos (operador_identificador, realizado_em desc);
