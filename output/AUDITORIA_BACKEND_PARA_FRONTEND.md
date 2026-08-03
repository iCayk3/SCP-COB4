# Auditoria do backend para avanço do frontend

Data da reavaliação: 03/08/2026.

## Conclusão executiva

O backend já suporta o início do frontend de autenticação, administração, configuração, financeiro e partes da operação. Entretanto, **ainda não está pronto para congelar os contratos das telas operacionais principais**.

Antes de avançar Minha Fila, Área de Trabalho, Cliente 360° e dashboards, devem ser concluídos os itens P0 abaixo. O principal risco atual não é ausência de código de negócio, mas autorização horizontal, contratos fragmentados e falta de testes reais de API/PostgreSQL.

Estado observado:

- Spring Boot, PostgreSQL, Flyway, JWT em cookie, RBAC, OpenAPI e observabilidade configurados.
- Núcleo de processo, RBX, filas/SLA, tarefas, timeline, atendimento, promessas, acordos, pagamentos, fechamento, workflow inicial, LGPD e auditoria presentes.
- 39 testes executados com sucesso.
- Testes usam H2 com `ddl-auto=create-drop` e Flyway desabilitado; portanto, as migrations PostgreSQL não são certificadas pela suíte.
- Apenas a segurança básica possui testes HTTP; a maioria dos contratos de controller não tem teste de integração.

## P0 — obrigatório antes das telas operacionais

### 1. Corrigir autorização horizontal de filas e tarefas

Hoje qualquer usuário autenticado pode informar outro `responsavelIdentificador` ao consultar `/fila/{responsavelIdentificador}` ou `/tarefas`, e o endpoint de atualização de tarefa também não possui proteção por carteira/responsável.

Implementar:

- `GET /api/cobrancas/minha-fila`, obtendo o operador da sessão, sem identificador fornecido pelo cliente;
- consulta de outra carteira somente para supervisor/gerente/admin;
- validação de propriedade ou alçada ao alterar uma tarefa;
- testes HTTP de operador A tentando ler/alterar dados do operador B.

### 2. Corrigir CORS para operações idempotentes

O frontend envia `Idempotency-Key` ao sincronizar e reconciliar o RBX, mas o backend permite apenas `Authorization`, `Content-Type` e `Accept` nos headers CORS.

Implementar:

- permitir `Idempotency-Key` no CORS;
- testar preflight `OPTIONS` a partir da origem do frontend;
- documentar quais comandos exigem a chave.

### 3. Criar um contrato agregado de Processo/Cliente 360°

Não existe um endpoint de detalhe completo do processo. Atualmente a tela precisa combinar lista de cobranças, protocolos por CPF, workflow, timeline, atendimentos, anexos, agenda, promessas, acordos e pagamentos em várias chamadas.

Implementar um contrato estável, por exemplo:

- `GET /api/processos/{referencia}` para cabeçalho, cliente, contrato, boletos, saldo, SLA, responsável, estado e ações permitidas;
- `GET /api/clientes/{cpf}/visao-360` para protocolos relacionados e resumo consolidado;
- respostas tipadas em DTO, sem `Object` e sem records internos de service;
- campo `acoesPermitidas` calculado pelo backend para o frontend não duplicar regras de alçada/workflow.

### 4. Paginar e filtrar coleções operacionais

Minha fila, tarefas, timeline, atendimentos, agenda, usuários, acordos e pagamentos retornam listas sem paginação. Isso não escala para operação real e obriga o frontend a carregar e filtrar tudo localmente.

Implementar:

- paginação uniforme (`itens`, `pagina`, `tamanho`, `totalElementos`, `totalPaginas`);
- filtros de fila: status, estado, prioridade, faixa, SLA, dias de atraso, valor e busca;
- ordenação autorizada por campos conhecidos;
- limites máximos de página;
- índices PostgreSQL coerentes com filtros e ordenação.

### 5. Congelar e certificar o contrato HTTP

O OpenAPI possui pouca descrição e quase não há testes de controllers. O frontend precisa de respostas e erros previsíveis.

Implementar:

- OpenAPI completo dos endpoints usados pelo frontend;
- esquema único de erro com `codigo`, `message`, `campos`, `timestamp` e `traceId`;
- retorno 404 explícito para recurso inexistente — hoje `NoSuchElementException` tende a cair no 500 genérico;
- testes MockMvc para sucesso, validação, 401, 403, 404 e conflito;
- teste de compatibilidade entre OpenAPI e serviços do frontend.

### 6. Testar PostgreSQL e Flyway de verdade

A suíte atual não executa as nove migrations: usa H2, cria o schema pelo Hibernate e desativa Flyway.

Implementar:

- testes de integração com PostgreSQL real via container;
- aplicar Flyway do zero e validar `ddl-auto=validate`;
- testar upgrade de uma base na versão anterior;
- smoke test dos repositórios com consultas PostgreSQL específicas;
- CI bloqueando merge quando migration ou validação falhar.

### 7. Definir e expor a unidade oficial do processo

O código indica protocolo agregado por contrato, mas essa decisão precisa ficar formalmente congelada no contrato e nas constraints.

Implementar/confirmar:

- chave de unicidade do processo ativo por contrato/ciclo;
- comportamento de múltiplos títulos do mesmo contrato;
- pagamento parcial, estorno, reabertura e novo ciclo de inadimplência;
- identificadores imutáveis e exemplos no OpenAPI;
- testes de concorrência e idempotência.

## P1 — necessário para Área de Trabalho e operação completa

### 8. Endpoint de Área de Trabalho do usuário

Criar uma resposta própria para o primeiro viewport:

- resumo do dia;
- próxima atividade sugerida;
- tarefas atrasadas;
- promessas do dia;
- SLAs críticos;
- contadores por fila;
- desempenho do usuário;
- notificações pendentes.

As métricas mensais atuais não substituem esse contrato operacional.

### 9. Dashboard e supervisão com consultas agregadas eficientes

O serviço atual de métricas usa `findAll()` e agrega em memória. Isso deve ser substituído antes de dashboards com volume real.

Implementar:

- consultas agregadas no banco por período, equipe, operador, cidade, faixa e estado;
- endpoints separados para resumo executivo, operação, equipe, SLA e integrações;
- cache curto quando apropriado;
- fórmula oficial e fonte de cada KPI;
- testes com golden dataset e carga.

### 10. Completar domínio de atendimento

O canal persistido atualmente aceita apenas `CHAT`, embora o produto exija WhatsApp, telefone, SMS, presencial e e-mail.

Implementar:

- catálogo de canais e resultados alinhado ao produto;
- duração, retorno agendado e vínculos com promessa/acordo/visita;
- templates e mensagens somente quando o fornecedor de canal estiver definido;
- testes da regra “todo atendimento possui resultado e próxima ação”.

### 11. Versionar workflow em vez de editar em uso

Fluxos possuem estados e transições configuráveis, porém não há modelo de versão/publicação. A edição atual pode alterar a interpretação de processos existentes.

Implementar:

- rascunho, validação, publicação e versão;
- processo vinculado à versão de origem;
- bloqueio de edição da versão publicada;
- simulador e detecção de estados órfãos/transições inválidas;
- rollback ou desativação segura.

### 12. Fortalecer segurança da sessão e da API

O cookie usa `HttpOnly`, `SameSite=Strict` e pode usar `Secure`, o que é positivo. Ainda assim, a aplicação opera com autenticação por cookie e CSRF desabilitado.

Implementar/validar:

- decisão formal entre proteção CSRF por token ou garantia arquitetural equivalente;
- `Secure=true` obrigatório fora de desenvolvimento;
- Swagger e `/api-docs` desabilitados ou protegidos em produção;
- Prometheus não público externamente;
- rate limit de login e endpoints RBX;
- testes de CORS, CSRF, expiração e revogação.

### 13. Melhorar consistência e evolutividade das respostas

Implementar:

- evitar `Object` nos controllers;
- DTOs públicos fora dos services;
- enums/catálogos consumíveis pelo frontend;
- datas sempre com offset e moeda com regra explícita;
- ETag ou versão para prevenir sobrescrita concorrente em configurações;
- `traceId` propagado em resposta de erro e logs.

## P2 — pode ser desenvolvido depois do frontend-base

- cobrança externa, visitas, GPS, fotos e retirada;
- encaminhamento e retorno jurídico;
- comunicação omnicanal real;
- COC em tempo real e presença operacional confiável;
- notificações push/internas;
- regras avançadas e motor de eventos desacoplado;
- IA, score e recomendações;
- multiempresa, segundo ERP e API pública.

Esses itens não devem bloquear o frontend-base, desde que rotas e navegação sejam protegidas por feature flags.

## Frontend que pode avançar agora

Com os contratos atuais, é seguro trabalhar em paralelo nas seguintes áreas, preferencialmente usando o OpenAPI real e não mocks livres:

- login, logout, troca obrigatória de senha e sessão;
- usuários, perfis e presença;
- configurações de faixas, motivos, sincronização e política financeira;
- histórico técnico de sincronização e falhas RBX;
- editor visual do workflow atual, tratando-o como beta até o versionamento;
- planejamento/backlog e fechamento mensal;
- LGPD e incidentes;
- componentes visuais desacoplados de dados: timeline, indicador de SLA, cartões e estados vazios/erro.

As telas Minha Fila, Área de Trabalho, Cliente 360°, tarefas e dashboards devem aguardar ao menos os itens P0 1 a 7, ou trabalhar contra contratos explicitamente provisórios.

## Critério de “backend pronto para o frontend operacional”

Considerar o backend pronto quando:

1. operador não consegue consultar nem alterar carteira/tarefa alheia;
2. preflight CORS passa para todos os headers usados pelo frontend;
3. existe detalhe agregado e tipado de processo/Cliente 360°;
4. listas operacionais estão paginadas e filtráveis;
5. OpenAPI está congelado e possui erro uniforme;
6. testes HTTP cobrem perfis e jornadas críticas;
7. migrations passam em PostgreSQL real no CI;
8. processo por contrato/ciclo e exceções financeiras estão formalizados;
9. frontend gera/valida seus tipos a partir do contrato;
10. uma jornada E2E passa: login → minha fila → processo → atendimento → próxima ação → timeline.

## Ordem recomendada de implementação

1. Autorização horizontal + CORS.
2. Contrato agregado de processo/Cliente 360°.
3. Paginação, filtros e índices.
4. Erro uniforme + OpenAPI + DTOs tipados.
5. PostgreSQL/Flyway no CI e testes de controllers.
6. Unidade oficial do processo e testes financeiros de exceção.
7. Área de Trabalho e dashboards agregados.
8. Canais de atendimento e versionamento de workflow.

Com uma equipe backend pequena, os itens P0 representam aproximadamente duas a quatro sprints, dependendo principalmente da disponibilidade do ambiente RBX e da decisão final sobre a unidade do processo.
