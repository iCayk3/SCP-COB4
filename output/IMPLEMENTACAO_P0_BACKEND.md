# Fechamento P0 do backend

Data da validação: 03/08/2026

## Situação

Os bloqueadores P0 levantados na auditoria foram implementados. O backend dispõe agora do contrato mínimo necessário para iniciar o frontend sem depender de listas ilimitadas, composição manual da visão do processo ou acesso horizontal inseguro.

## Entregas

- Controle de carteira nas filas, tarefas, processos, acordos e pagamentos.
- Rotas próprias do operador (`minha-fila` e `minhas-tarefas`) e restrição das consultas arbitrárias à gestão.
- CORS compatível com `Idempotency-Key`.
- Consulta agregada de processo e visão 360 do cliente.
- Paginação padronizada para fila, tarefas, timeline, atendimentos, agenda, usuários, acordos e pagamentos.
- Erros HTTP estáveis com código, status, mensagem, campos, horário e `traceId`.
- OpenAPI com autenticação e esquema de erro documentados.
- Regra formal de processo ativo único por cliente e contrato, protegida por índice parcial no PostgreSQL.
- Índices operacionais para as consultas principais.
- Testes de contrato HTTP e teste PostgreSQL/Flyway com Testcontainers.
- Console local compacto e legível no IntelliJ; logs estruturados JSON ficaram restritos ao perfil `prod`.
- Preflight somente leitura para detectar CPF/contrato ativo duplicado antes da V10.
- OpenAPI congelado em `frontend/openapi/sgc-api.json`, com tipos TypeScript gerados e verificação de divergência na CI.
- Jornada de contrato automatizada: login, fila, processo, atendimento, próxima ação e timeline.

## Validação executada

- Suíte completa final: **47 testes, 0 falhas, 0 erros**.
- Um teste PostgreSQL/Testcontainers foi ignorado porque o Docker não está disponível nesta máquina. Ele está pronto para execução em CI ou em uma estação com Docker ativo.
- Teste adicional de inicialização após o ajuste de logs: **1 teste, 0 falhas**.
- O frontend executa `api:check` antes do build para impedir tipos desatualizados.

## Contratos principais para o frontend

- `GET /api/processos/{referencia}`
- `GET /api/clientes/{cpf}/visao-360`
- `GET /api/cobrancas/minha-fila/pagina`
- `GET /api/cobrancas/minhas-tarefas/pagina`
- `GET /api/processos/{referencia}/timeline/pagina`
- `GET /api/processos/{referencia}/atendimentos/pagina`
- `GET /api/processos/{referencia}/agenda/pagina`
- `GET /api/usuarios/pagina`
- `GET /api/financeiro/acordos/pagina?cobrancaReferencia=...`
- `GET /api/financeiro/pagamentos/pagina?cobrancaReferencia=...`

## Observação de implantação

Antes de aplicar a migração V10 em produção, deve-se verificar se já existem dois processos ativos para a mesma combinação de CPF e contrato. Caso existam, os dados precisam ser conciliados antes da criação do índice de unicidade.
