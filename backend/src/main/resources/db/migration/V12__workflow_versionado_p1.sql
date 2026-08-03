alter table fluxos_cobranca add column if not exists versao integer not null default 1;
alter table fluxos_cobranca add column if not exists status_versao varchar(20) not null default 'PUBLICADO';
alter table fluxos_cobranca add column if not exists codigo_origem varchar(60);
alter table fluxos_cobranca add column if not exists publicado_em timestamp with time zone;
alter table fluxos_cobranca add column if not exists row_version bigint not null default 0;
update fluxos_cobranca set codigo_origem=codigo where codigo_origem is null;
alter table fluxos_cobranca alter column codigo_origem set not null;
alter table fluxos_cobranca add constraint ck_fluxo_status_versao check(status_versao in ('RASCUNHO','PUBLICADO','DESATIVADO'));
create unique index if not exists uk_fluxo_origem_versao on fluxos_cobranca(codigo_origem,versao);
