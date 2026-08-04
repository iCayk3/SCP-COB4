# Guia permanente do projeto SCP-COB4

Este arquivo e o ponto de entrada para qualquer conversa ou agente que trabalhe neste repositorio. Leia-o antes de analisar, planejar ou alterar o projeto. Depois, consulte somente os documentos relacionados ao assunto da tarefa.

## Objetivo do produto

O SCP-COB4 e o Sistema de Gestao de Cobranca (SGC). O produto cobre autenticacao e administracao, filas e tarefas de cobranca, Processo/Cliente 360, atendimentos, agenda, promessas, acordos, pagamentos, workflow, dashboards, integracao RBX, auditoria e LGPD.

## Estrutura do repositorio

- `backend/`: API Java 26, Spring Boot 4.1, Spring Security, JPA, PostgreSQL, Flyway e Maven Wrapper.
- `frontend/`: React 19, TypeScript, Vite e Material UI.
- `frontend/openapi/sgc-api.json`: contrato OpenAPI congelado consumido pelo frontend.
- `frontend/src/types/api.generated.ts`: tipos TypeScript gerados do OpenAPI; nao editar manualmente.
- `docs/`: documentacao de operacao e homologacao.
- `infra/`: arquivos de infraestrutura.
- `scripts/`: backup, restauracao e rotinas auxiliares.
- `output/`: especificacoes funcionais, auditorias e registros de implementacao.
- `compose.homolog.yml`: ambiente de homologacao com Docker Compose.

## Estado atual confirmado

Data da ultima consolidacao documental: 04/08/2026.

- P0 do backend: implementado. Consulte `output/IMPLEMENTACAO_P0_BACKEND.md`.
- P1 do backend: implementado. Consulte `output/IMPLEMENTACAO_P1_BACKEND.md`.
- Ultima suite completa registrada no fechamento P1: 51 testes, sem falhas ou erros e 1 teste ignorado por ausencia de Docker.
- Build de producao do frontend e sincronizacao OpenAPI/TypeScript foram registrados como aprovados no fechamento P1.
- A entrada autenticada do frontend usa a Area de Trabalho real do SGC e a tela de cobrancas consulta a fila paginada da sessao. Consulte `output/IMPLEMENTACAO_AREA_TRABALHO_FRONTEND.md`.
- As migrations existentes vao de V1 a V12.
- O frontend pode avancar usando os contratos P0/P1, mas cada nova conversa deve conferir o codigo e executar as validacoes pertinentes antes de afirmar que o estado continua valido.

### Pendencia operacional conhecida

O teste real de PostgreSQL/Flyway via Testcontainers nao foi executado na ultima validacao local porque o Docker estava indisponivel. Ele esta implementado e deve ser executado em CI ou em uma maquina com Docker antes de promover migrations ou liberar uma versao.

Antes da migration V10 em uma base existente, execute o preflight documentado no fechamento P0 e concilie eventuais processos ativos duplicados por CPF e contrato.

## Contratos principais para o frontend

- `GET /api/area-trabalho`
- `GET /api/cobrancas/minha-fila/pagina`
- `GET /api/cobrancas/minhas-tarefas/pagina`
- `GET /api/processos/{referencia}`
- `GET /api/clientes/{cpf}/visao-360`
- `GET /api/processos/{referencia}/timeline/pagina`
- `GET /api/processos/{referencia}/atendimentos/pagina`
- `GET /api/processos/{referencia}/agenda/pagina`
- `GET /api/dashboards/executivo`
- `GET /api/dashboards/operacao`
- `GET /api/dashboards/equipe`
- `GET /api/dashboards/sla`
- `GET /api/dashboards/integracoes`
- `GET /api/catalogos/operacionais`
- `GET /api/usuarios/pagina`
- `GET /api/financeiro/acordos/pagina?cobrancaReferencia=...`
- `GET /api/financeiro/pagamentos/pagina?cobrancaReferencia=...`

Use o OpenAPI como fonte de verdade para payloads, parametros e respostas. Nao invente contratos no frontend e nao mantenha tipos manuais paralelos aos tipos gerados.

## Comandos de validacao

Execute os comandos a partir da pasta indicada.

### Backend (`backend/`)

```powershell
.\mvnw.cmd test
```

Para iniciar localmente com o perfil de desenvolvimento:

```powershell
.\mvnw.cmd spring-boot:run "-Dspring-boot.run.profiles=dev"
```

### Frontend (`frontend/`)

```powershell
npm install
npm run api:check
npm run lint
npm run build
```

Para desenvolvimento:

```powershell
npm run dev
```

Quando o contrato da API mudar:

```powershell
npm run api:generate
npm run api:check
```

Inclua no mesmo trabalho a atualizacao de `frontend/openapi/sgc-api.json` e dos tipos gerados. A CI deve rejeitar divergencias.

### Homologacao (`raiz do repositorio`)

Siga `docs/OPERACAO.md`. O comando principal e:

```powershell
docker compose --env-file .env -f compose.homolog.yml up -d --build
```

A aplicacao somente esta pronta quando `/actuator/health/readiness` responder com sucesso. Nunca grave segredos no repositorio; use `.env` e os arquivos ignorados em `secrets/` conforme `.env.example`.

## Regras de implementacao

- Preserve a autorizacao horizontal: operador nao pode consultar nem alterar carteira, tarefa, processo, acordo ou pagamento de outro operador sem alcada de gestao.
- Prefira as rotas `minha-fila` e `minhas-tarefas` para a sessao corrente; nao aceite identificador arbitrario do cliente para simular o usuario autenticado.
- Mantenha colecoes operacionais paginadas e com ordenacao restrita a campos conhecidos.
- Respostas de erro devem conservar o contrato uniforme com codigo, status, mensagem, campos, timestamp e `traceId`.
- Todo novo endpoint consumido pelo frontend deve possuir DTO tipado, documentacao OpenAPI e testes HTTP de sucesso e erros relevantes (401, 403, 404, validacao e conflito quando aplicavel).
- Datas de API devem usar ISO-8601 com offset. Regras monetarias devem permanecer explicitas e usar tipos decimais apropriados.
- Comandos autenticados por cookie devem preservar as protecoes de Origin/Referer, CORS restrito e `SameSite=Strict`.
- Swagger/OpenAPI devem continuar desabilitados em producao; Prometheus nao deve ser exposto publicamente.
- Logs locais devem permanecer compactos e legiveis no IntelliJ. Logs JSON estruturados sao do perfil `prod`.
- Nao edite migration Flyway ja aplicada. Crie a proxima migration incremental e valide tanto instalacao limpa quanto evolucao da base.
- Nao altere uma versao publicada de workflow. Crie nova versao e preserve o vinculo dos processos com a versao de origem.
- Nao afirme que uma entrega esta concluida somente pela presenca do codigo: execute testes proporcionais ao risco e registre qualquer validacao que nao possa ser feita.

## Hierarquia da documentacao

Ao encontrar divergencias, use esta ordem:

1. codigo, migrations, testes e OpenAPI atuais;
2. este `AGENTS.md` para contexto e regras permanentes;
3. documentos de fechamento P1 e P0;
4. especificacoes funcionais e operacionais;
5. auditorias e plano de sprints historicos.

A auditoria de backend descreve o estado anterior as implementacoes P0/P1. Use-a para entender a origem das decisoes, nao como fotografia atual do projeto.

## Indice de leitura por assunto

- Estado do P0: `output/IMPLEMENTACAO_P0_BACKEND.md`
- Estado do P1: `output/IMPLEMENTACAO_P1_BACKEND.md`
- Area de Trabalho do frontend: `output/IMPLEMENTACAO_AREA_TRABALHO_FRONTEND.md`
- Diagnostico anterior ao P0/P1: `output/AUDITORIA_BACKEND_PARA_FRONTEND.md`
- Plano geral de implementacao e testes: `output/PLANO_DE_SPRINTS_SGC.md`
- Versao visual do plano: `output/PLANO_DE_SPRINTS_SGC.html`
- Regras de cobranca: `output/OPERACAO_COBRANCA_SGC.md`
- Glossario do negocio: `output/GLOSSARIO_OPERACIONAL_SGC.md`
- LGPD: `output/ESPECIFICACAO_LGPD_SGC.md`
- Homologacao, metricas, backup e restauracao: `docs/OPERACAO.md`
- Documento de origem: `output/pdf/SGC_conversa_a_partir_volume_1.pdf`

## Como iniciar uma nova conversa

Informe o assunto e peça explicitamente: "Leia o `AGENTS.md` e os documentos indicados nele para este assunto antes de trabalhar". A conversa nao herda automaticamente o historico de outras conversas, mas este arquivo permite reconstruir o contexto a partir do repositorio.

Ao finalizar uma mudanca relevante, atualize o documento de fechamento correspondente ou crie um novo registro datado em `output/`, e atualize neste arquivo apenas o estado consolidado, as pendencias e as regras que devem valer para trabalhos futuros.
