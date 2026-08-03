# Fechamento P1 do backend

Data: 03/08/2026

## Entregas

- Área de Trabalho por usuário com fila, tarefas atrasadas, promessas do dia, SLA crítico, valor da carteira, próxima atividade, alertas e desempenho diário.
- Dashboards separados em executivo, operação, equipe, SLA e integrações, usando consultas filtradas e agregações no banco.
- Atendimento multicanal: chat, WhatsApp, telefone, SMS, e-mail e presencial.
- Atendimento com duração, retorno agendado e vínculos opcionais com promessa, acordo e agendamento.
- Catálogo operacional tipado para canais, resultados, prioridades e faixas.
- Workflow com rascunho, validação de transições/estados órfãos, publicação imutável, nova versão e desativação segura.
- Controle de concorrência de workflow por `rowVersion`, retornando conflito para versão desatualizada.
- Proteção equivalente contra CSRF para autenticação em cookie: `SameSite=Strict`, CORS restrito e validação de Origin/Referer em comandos.
- Rate limit configurável para login e integrações RBX.
- Prometheus restrito à gestão; Swagger e OpenAPI permanecem desabilitados em produção.
- `traceId` propagado entre requisição, resposta, erros e contexto de logs.
- DTOs e catálogos públicos tipados, datas ISO-8601 com offset e regra monetária documentada no OpenAPI.
- Migrations V11 e V12 para atendimento multicanal e workflow versionado.
- OpenAPI e tipos TypeScript regenerados e certificados pela CI.

## Endpoints principais

- `GET /api/area-trabalho`
- `GET /api/dashboards/executivo`
- `GET /api/dashboards/operacao`
- `GET /api/dashboards/equipe`
- `GET /api/dashboards/sla`
- `GET /api/dashboards/integracoes`
- `GET /api/catalogos/operacionais`
- `POST /api/fluxos/{id}/publicar`
- `POST /api/fluxos/{id}/nova-versao`
- `GET /api/fluxos/{id}/validacao`
- `POST /api/fluxos/{id}/desativar`

## Validação

- Suíte completa executada durante a implementação: **51 testes, 0 falhas, 0 erros, 1 ignorado por ausência de Docker**.
- Testes específicos finais de P1: **4 testes, 0 falhas**.
- OpenAPI exportado e tipos TypeScript sincronizados.
- Build de produção do frontend aprovado.
- O teste PostgreSQL/Flyway foi atualizado para exigir a migration 12 e as estruturas P1 quando executado em ambiente com Docker.
