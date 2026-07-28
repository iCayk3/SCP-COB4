# SGC - Plano de sprints de implementação, validação e testes

Fonte: `SGC_conversa_a_partir_volume_1.pdf` (139 páginas, Volumes 1 a 11 e Product Blueprint).

## Premissas de planejamento

- Sprints de 2 semanas.
- Time de referência: 1 PO/analista de negócio, 1 UX/UI, 2 back-end, 2 front-end, 1 QA e apoio parcial de DevOps/segurança.
- Estratégia: monólito modular orientado a domínio e eventos no MVP; extração de serviços apenas quando carga, isolamento ou evolução justificarem.
- Primeiro ERP: RBX Soft. Outros conectores entram após estabilização do contrato de integração.
- Web responsiva no MVP; experiência móvel de campo evolui posteriormente.
- IA não toma decisões críticas nem altera regras. Toda recomendação deve ser explicável, revisável e auditável.
- O plano separa entrega em: Fundação e método, MVP operacional, Gestão e campo, Inteligência e SaaS.

## Definição de Pronto global

Uma história somente é considerada pronta quando:

- critérios de aceitação foram aprovados pelo PO;
- regra de negócio e permissão associadas estão documentadas;
- testes unitários e de integração passaram;
- fluxo crítico possui teste ponta a ponta;
- logs, auditoria, métricas e tratamento de erro foram incluídos quando aplicáveis;
- não há vulnerabilidade crítica ou alta conhecida;
- interface foi validada nos navegadores e resoluções suportados;
- documentação de API e operação foi atualizada;
- QA aprovou no ambiente de homologação;
- evidências de teste estão vinculadas à história.

## Marcos

| Marco | Sprints | Resultado |
|---|---:|---|
| Fundação e Método SGC | 0-2 | Operação validada, arquitetura e base técnica |
| MVP operacional | 3-8 | Cobrança interna ponta a ponta integrada ao RBX |
| Gestão e campo | 9-12 | COC, regras configuráveis, externa e retirada |
| Inteligência | 13-15 | Recomendações e IA com governança |
| SaaS e expansão | 16-18 | Multiempresa, multi-ERP e preparação comercial |

---

## Sprint 0 - Método SGC e baseline do produto

**Objetivo:** transformar as intenções do documento em uma operação aprovada e mensurável.

**Implementação/especificação**

- Mapear rotina diária, papéis, RACI, critérios de distribuição de carteira e fechamento mensal.
- Definir política de cobrança: faixas de atraso, canais, cadência, descontos, visitas, retirada, jurídico e encerramento.
- Consolidar estados, eventos, filas, SLAs e motivos em um glossário único.
- Resolver inconsistências: processo por cliente, contrato ou título; fonte oficial de cada dado; condição de reabertura.
- Definir MVP, métricas de sucesso e backlog priorizado.
- Mapear LGPD: bases legais, retenção, acesso, exportação, anonimização e evidências de consentimento quando aplicável.

**Validações**

- Workshops com diretoria, cobrança, supervisão, financeiro, campo, TI e responsável por privacidade.
- Simulação de 10 casos reais, incluindo pagamento parcial, títulos múltiplos, cancelamento e cliente sem contato.
- Aprovação formal do mapa operacional e da matriz de responsabilidades.

**Testes/evidências**

- Testes de mesa dos fluxos principal, alternativos e exceções.
- Matriz requisito -> regra -> processo -> futuro caso de teste.
- Critério de saída: nenhuma decisão bloqueadora do MVP em aberto.

## Sprint 1 - UX, arquitetura e contratos

**Objetivo:** produzir a base executável do produto sem antecipar funcionalidades.

**Implementação**

- Protótipo navegável: login, área de trabalho, Minha Fila, Cliente 360°, atendimento, promessa e supervisão.
- Modelo de domínio inicial: cliente, contrato, título, processo, estado, evento, tarefa e timeline.
- ADRs de arquitetura, autenticação, autorização, auditoria, eventos, idempotência e versionamento.
- Contrato OpenAPI inicial e contrato do conector RBX.
- Modelo físico inicial, convenções de migrations e estratégia de dados de teste.
- Threat model e classificação dos dados.

**Validações**

- Teste de usabilidade com operador, supervisor e financeiro.
- Revisão do modelo com negócio e integração RBX.
- Revisão arquitetural de transações, concorrência e consistência eventual.

**Testes/evidências**

- Testes de contrato com mocks do RBX.
- Prova de conceito de um evento idempotente e uma transição auditada.
- Critério de saída: protótipo e contratos aprovados; riscos técnicos com mitigação.

## Sprint 2 - Plataforma, segurança e observabilidade

**Objetivo:** disponibilizar uma fundação implantável e segura.

**Implementação**

- Repositório, pipeline CI/CD, ambientes de desenvolvimento, teste e homologação.
- Banco, migrations, seeds, configuração externa, segredos e feature flags.
- Login, recuperação de acesso, bloqueio após tentativas, sessão e opção preparada para MFA.
- Usuários, perfis e permissões (RBAC).
- logs estruturados, correlação, métricas, health checks e auditoria básica.
- Backup, restauração e política de retenção.

**Validações**

- Matriz de acesso por perfil: diretor, gerente, supervisor, operador, campo, financeiro e administrador.
- Aprovação de política de senha/sessão e segregação de funções.
- Ensaio de restauração de backup.

**Testes/evidências**

- Unitários de autenticação e autorização.
- Integração de banco/migrations.
- Segurança: brute force, sessão expirada, acesso horizontal/vertical e vazamento em logs.
- Smoke test do deploy e teste de restauração.

## Sprint 3 - SGC Core: processo, estados e timeline

**Objetivo:** implementar o núcleo de domínio.

**Implementação**

- Processo de cobrança com identificador único, responsável, prioridade, SLA e origem.
- Máquina de estados inicial e transições autorizadas.
- Timeline append-only e auditoria de transições.
- Motivos de encerramento e bloqueio de edição após encerramento.
- APIs de processo e consulta de timeline.

**Validações**

- Revisar transições com operadores e supervisores.
- Validar concorrência: pagamento e atendimento chegando simultaneamente.
- Confirmar granularidade definida no Sprint 0 (contrato/título/processo).

**Testes/evidências**

- Unitários para todas as transições válidas e inválidas.
- Integridade: processo sem responsável, duplicidade, timeline imutável e encerramento sem motivo.
- Concorrência, idempotência e reconstrução da trajetória do processo.

## Sprint 4 - Integração RBX e entrada da inadimplência

**Objetivo:** criar processos automaticamente a partir do ERP.

**Implementação**

- Sincronização de clientes, contratos, títulos e pagamentos.
- Evento de título vencido e criação idempotente do processo.
- Sincronização imediata e agendada; sincronização manual por cliente.
- Retry com backoff, fila de falhas, reprocessamento e painel técnico mínimo.
- Registro de origem, latência e resultado da integração.

**Validações**

- Reconciliação amostral SGC x RBX.
- Definir comportamento para dados incompletos, títulos alterados, estornos e indisponibilidade.
- Medir o SLA de até 30 segundos para eventos imediatos.

**Testes/evidências**

- Contrato/sandbox RBX e fixtures versionadas.
- Duplicidade, reordenação, replay, timeout e falha parcial.
- Carga inicial e reconciliação automática.
- Critério de saída: nenhum evento perdido e duplicidade zero nos cenários certificados.

## Sprint 5 - Filas, distribuição, SLA e tarefas

**Objetivo:** entregar automaticamente o próximo trabalho ao operador.

**Implementação**

- Filas operacionais, carteira individual e distribuição inicial.
- Regras de prioridade e ordenação.
- Tarefas, agenda, prazos, alertas e temporizadores de SLA.
- Redistribuição pelo supervisor com motivo e auditoria.
- Área de Trabalho e Minha Fila em versão funcional.

**Validações**

- Simular cargas desiguais, ausência do operador e fila vazia.
- Validar prioridades com amostra real de carteira.
- Aprovar alertas, escalonamentos e regras de redistribuição.

**Testes/evidências**

- Determinismo e justiça da distribuição.
- Virada de data, feriado, fuso horário, SLA pausado e tarefa vencida.
- Testes E2E de login -> fila -> abrir processo.
- Desempenho com volume-alvo de processos simultâneos.

## Sprint 6 - Cliente 360° e atendimento

**Objetivo:** permitir atendimento completo e rápido em uma única jornada.

**Implementação**

- Cliente 360° com dados cadastrais, contratos, títulos, timeline, tarefas e agenda.
- Registro de atendimento: canal, resultado, observação, duração, anexos e próxima ação obrigatória.
- Ações rápidas e busca global.
- Atualização cadastral controlada conforme sistema mestre.

**Validações**

- Teste moderado de usabilidade; meta de registro inferior a 30 segundos.
- Revisão de campos obrigatórios, linguagem e atalhos com operadores.
- Validar quais dados podem ser corrigidos no SGC e quais retornam ao RBX.

**Testes/evidências**

- Validações de campos e próxima ação.
- Permissões e exposição de dados sensíveis.
- Upload malicioso, tipo/tamanho de arquivo e antivírus, se adotado.
- E2E do primeiro contato e testes de acessibilidade.

## Sprint 7 - Promessas, negociação e aprovações

**Objetivo:** cobrir o ciclo de recuperação financeira.

**Implementação**

- Promessa com valor, data, situação e retorno automático.
- Detecção de promessa cumprida/quebrada via RBX.
- Simulador de negociação: juros, multa, desconto, entrada, parcelas e protocolo.
- Aprovação de desconto/exceção pelo supervisor.
- Geração e envio de proposta preparada para canais.

**Validações**

- Financeiro valida fórmulas, arredondamento, calendário e conciliação.
- Negócio valida alçadas e segregação de funções.
- Simulação de pagamento total, parcial, antecipado, estorno e quebra.

**Testes/evidências**

- Testes de propriedade/limites para cálculos monetários.
- Datas inválidas, feriados, parcelas e concorrência de aprovação.
- E2E: negociar -> aprovar -> prometer -> pagar/quebrar.
- Auditoria integral das decisões e valores anterior/novo.

## Sprint 8 - Pagamento, encerramento, dashboard básico e piloto MVP

**Objetivo:** fechar o fluxo ponta a ponta e colocá-lo em piloto controlado.

**Implementação**

- Pagamento encerra promessa, agenda, tarefas e processo conforme política.
- Tratamento de pagamento parcial, estorno e reabertura.
- Dashboard básico: carteira, recuperação, promessas, SLA e produtividade.
- Exportação operacional mínima.
- Migração/carga piloto, runbook, suporte e treinamento.

**Validações**

- UAT com grupo pequeno em paralelo ao processo atual.
- Reconciliação diária financeira e dos estados.
- Comparar KPIs do sistema com cálculo independente.

**Testes/evidências**

- Regressão completa do MVP.
- Carga, pico, soak e resiliência da integração.
- Teste de recuperação de desastre e rollback de implantação.
- Critério de saída: operação piloto estável, números reconciliados e aceite formal.

## Sprint 9 - COC e supervisão em tempo real

**Objetivo:** dar controle operacional ao supervisor.

**Implementação**

- Painéis de operação, equipe, financeiro, alertas e integrações.
- Drill-down de indicador para processos.
- Status de operadores e inatividade configurável.
- Alertas de processo sem responsável, SLA, promessa, fila e integração.

**Validações**

- Sala de controle simulada com supervisores.
- Definir frequência de atualização e tolerância de defasagem.
- Homologar fórmulas e semântica de todos os KPIs.

**Testes/evidências**

- Correção de agregações, filtros e permissões.
- Atualização em tempo real, desconexão/reconexão e dados atrasados.
- Carga do dashboard sem degradar a operação transacional.

## Sprint 10 - Motor de regras e workflow configurável

**Objetivo:** permitir mudanças operacionais seguras sem alteração de código.

**Implementação**

- Cadastro de estados, eventos, transições, ações, SLAs e regras.
- Validador de fluxo: estados órfãos, ciclos inválidos e transições inalcançáveis.
- Versionamento, publicação, rollback e simulação.
- Processos ativos permanecem na versão original; novos usam a publicada.
- Aprovação em quatro olhos para publicação.

**Validações**

- Modelar fluxos de duas políticas diferentes.
- Comparar simulador com resultados esperados em casos reais.
- Revisar governança de alteração e impacto.

**Testes/evidências**

- Compatibilidade entre versões e migração controlada.
- Sandbox de regras, limites de execução e proteção contra loops.
- Regressão automática gerada a partir da matriz de transições.

## Sprint 11 - Comunicação omnicanal

**Objetivo:** centralizar mensagens e rastrear resultados.

**Implementação**

- Adaptadores para WhatsApp e e-mail; SMS/telefonia conforme fornecedor escolhido.
- Templates, envio, recebimento, status, anexos, opt-out e fila de mensagens.
- Vinculação ao processo/timeline e reenvio controlado.
- Monitoramento de falhas e custos.

**Validações**

- Homologação de templates, horários e linguagem.
- Privacidade, consentimento e política de retenção.
- Homologação com provedores externos.

**Testes/evidências**

- Contrato do provedor, webhook assinado e idempotente.
- Rate limit, indisponibilidade, duplicidade e status fora de ordem.
- Segurança de conteúdo/anexos e prevenção de envio ao destinatário errado.

## Sprint 12 - Cobrança externa e retirada

**Objetivo:** cobrir o trabalho de campo.

**Implementação**

- Ordem de serviço, agenda, rotas, check-in/out, GPS, fotos, assinatura e resultado.
- Fluxo de retirada com equipamentos recolhidos.
- Operação móvel responsiva e modo offline básico com sincronização.
- Mapa e redistribuição de visitas.

**Validações**

- Teste em campo com agentes e diferentes condições de rede.
- Política de precisão/localização, consentimento e retenção.
- Conferência do inventário retirado com ERP.

**Testes/evidências**

- Offline/online, conflitos de sincronização e bateria/rede limitada.
- Geolocalização adulterada, anexos e permissões do dispositivo.
- E2E visita -> evidências -> retirada -> encerramento.

## Sprint 13 - Analytics, relatórios e Índice de Saúde

**Objetivo:** consolidar indicadores confiáveis e acionáveis.

**Implementação**

- Camada analítica e dicionário formal de métricas.
- Dashboards gerenciais, metas, ranking e filtros.
- Relatórios PDF/Excel/CSV e exportação para BI.
- Índice de Saúde da Operação com composição transparente.

**Validações**

- Cada métrica possui proprietário, fórmula, fonte, periodicidade e tolerância.
- Reconciliação com financeiro e amostra manual.
- Validar se ranking evita incentivos contraproducentes.

**Testes/evidências**

- Golden datasets para KPIs.
- Filtros, períodos, fuso, fechamento mensal e grandes exportações.
- Controle de acesso e mascaramento nas exportações.

## Sprint 14 - IA assistiva: resumo, mensagens e conhecimento

**Objetivo:** reduzir esforço sem automatizar decisões críticas.

**Implementação**

- Resumo do histórico com acesso ao registro original.
- Sugestão editável de mensagens.
- Assistente sobre políticas e procedimentos com fontes.
- Registro de prompt, modelo, versão, resposta, aceite/edição e usuário.
- Guardrails contra vazamento, prompt injection e conteúdo inadequado.

**Validações**

- Conjunto de avaliação criado por especialistas.
- Aprovação humana obrigatória antes de comunicação.
- Métricas: fidelidade, cobertura, taxa de edição, erro grave e tempo economizado.

**Testes/evidências**

- Avaliação offline, red team, dados sensíveis e respostas sem evidência.
- Latência, indisponibilidade e fallback sem IA.
- Auditoria e exclusão/retenção conforme política.

## Sprint 15 - Score, priorização e recomendações

**Objetivo:** apoiar priorização e decisão gerencial de forma explicável.

**Implementação**

- Baseline por regras antes de modelo estatístico.
- Score de recuperação e fatores explicativos.
- Recomendações de estratégia, risco operacional e previsão.
- Monitoramento de drift, qualidade e impacto por grupo.
- Feature flag, shadow mode e rollback imediato.

**Validações**

- Backtesting temporal e comparação com baseline.
- Avaliação de viés, estabilidade e custo de falsos positivos/negativos.
- Piloto em shadow mode; operador continua responsável.

**Testes/evidências**

- Qualidade de dados, leakage, reprodutibilidade e calibração.
- A/B teste apenas após aprovação de negócio/privacidade.
- Critério de saída: ganho mensurável sem piorar compliance ou experiência.

## Sprint 16 - Multiempresa e isolamento SaaS

**Objetivo:** preparar a plataforma para múltiplos clientes.

**Implementação**

- Tenant, filial, branding, parâmetros, quotas e segregação de dados.
- Provisionamento, administração, suporte e auditoria por tenant.
- Estratégia de cobrança/assinatura e medição de uso.

**Validações**

- Modelo operacional e comercial por tenant.
- Revisão de isolamento e responsabilidades de suporte.

**Testes/evidências**

- Testes sistemáticos de isolamento horizontal e cache.
- Backup/restauração por tenant, carga e noisy-neighbor.
- Pentest antes de produção comercial.

## Sprint 17 - Multi-ERP e API pública

**Objetivo:** desacoplar o produto do RBX.

**Implementação**

- Modelo canônico e SDK/contrato para conectores.
- Segundo conector ERP como prova de generalização.
- API pública versionada, portal/documentação, chaves e quotas.
- Webhooks de saída, assinatura e replay seguro.

**Validações**

- Matriz de capacidades por ERP e comportamento quando um recurso não existe.
- Homologação com segundo ERP.

**Testes/evidências**

- Suite de certificação comum a conectores.
- Compatibilidade retroativa, rate limit e rotação de credenciais.
- Chaos tests e reconciliação cross-system.

## Sprint 18 - Hardening e lançamento

**Objetivo:** tornar a solução operacionalmente sustentável.

**Implementação**

- Correções de hardening, performance e acessibilidade.
- SLOs/SLIs, alertas, on-call, incidentes, status e capacidade.
- Manuais de usuário/admin, treinamento, implantação e suporte.
- Plano de migração, rollback, continuidade e evolução.

**Validações**

- Go-live rehearsal com todas as áreas.
- Checklist jurídico, privacidade, segurança, financeiro e suporte.
- Aprovação do plano de capacidade e custos.

**Testes/evidências**

- Regressão completa, pentest, carga, soak, failover e disaster recovery.
- Game day de falha do ERP, canal de comunicação, fila e banco.
- Critério de saída: aceite executivo e operacional, riscos residuais formalmente aceitos.

---

## Estratégia contínua de testes

### Pirâmide

- **Unitários:** domínio, cálculos, regras, permissões e transições.
- **Integração:** banco, filas, cache, RBX, canais e armazenamento.
- **Contrato:** APIs, webhooks e conectores, executados no CI.
- **E2E:** poucas jornadas críticas, estáveis e orientadas ao risco.
- **Exploratórios:** a cada sprint em fluxos novos e áreas alteradas.
- **Não funcionais:** segurança, performance, resiliência, acessibilidade, privacidade e recuperação.

### Jornadas críticas obrigatórias

1. Título vence -> processo idempotente -> responsável -> fila -> primeiro contato.
2. Atendimento -> próxima ação -> tarefa/agenda -> timeline.
3. Negociação -> aprovação -> acordo/promessa -> pagamento -> encerramento.
4. Promessa vence sem pagamento -> quebra -> prioridade alta -> nova tarefa.
5. Pagamento parcial/estorno -> estado correto sem perda de histórico.
6. Sem contato -> supervisão -> visita -> retirada.
7. Falha RBX -> retry -> fila de falhas -> reprocessamento -> reconciliação.
8. Mudança de workflow -> processos antigos preservados e novos na versão publicada.
9. Tentativa de acesso indevido entre perfis/tenants -> bloqueio e auditoria.

## Ambiguidades que precisam de decisão antes do Sprint 3

- Um processo representa cliente, contrato, fatura/título ou ciclo agregado de inadimplência? O documento usa as quatro ideias.
- “Cada cliente terá um processo” conflita com “um processo por contrato em atraso” e “não duplicar por fatura”.
- Como pagamentos parciais, múltiplos títulos, estornos, renegociação e reativação afetam o estado?
- Quem é o sistema mestre para telefone, endereço, equipamentos e situação contratual?
- Qual é a política exata para fechamento após retirada e encaminhamento jurídico?
- Quais SLAs contam horas corridas ou úteis e quais eventos pausam o relógio?
- Quais fornecedores/canais estão aprovados e quais regras de consentimento/opt-out se aplicam?
- Volumes, concorrência, retenção, RTO/RPO e disponibilidade esperados ainda não foram quantificados.
- Fórmula do Índice de Saúde e definição formal dos KPIs ainda precisam de homologação.
- Para IA, ainda faltam base histórica, qualidade mínima, métricas de aceitação e política de uso de dados.

## Sequenciamento recomendado

O primeiro go-live deve ocorrer ao fim da Sprint 8, limitado à cobrança interna e a um grupo piloto. COC, workflow configurável, comunicação, campo e IA devem ser liberados gradualmente por feature flags. Multiempresa e multi-ERP só devem começar depois que o fluxo RBX e os indicadores estiverem reconciliados em produção.

Com a equipe de referência, o MVP ocupa aproximadamente 18 semanas contando Sprint 0; o produto completo deste plano ocupa aproximadamente 38 semanas. Datas devem ser recalculadas após sizing do backlog, disponibilidade real do RBX e decisões pendentes do Sprint 0.
