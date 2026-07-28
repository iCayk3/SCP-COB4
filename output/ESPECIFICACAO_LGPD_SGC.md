# Especificação LGPD — Sistema de Gestão de Cobrança

**Situação:** especificação técnica implementada; decisões de base legal e retenção pendentes de aprovação formal.  
**Escopo:** RBX, SGC, atendimento, campo, financeiro, jurídico, relatórios, exportações e logs.

## 1. Objetivo e limites

Esta especificação estabelece como o SGC deve coletar, utilizar, compartilhar, reter, exportar, anonimizar e eliminar dados pessoais. Ela não substitui parecer jurídico nem autoriza automaticamente eliminação de dados.

O tratamento deve observar finalidade, adequação, necessidade, transparência, segurança, prevenção, não discriminação e responsabilização. Uma nova integração ou relatório que use dados pessoais deve ser incluído no inventário antes de entrar em produção.

## 2. Agentes e responsabilidades

| Papel | Responsabilidade |
|---|---|
| Controlador | Organização que decide finalidades e meios do tratamento; deve ser identificada formalmente. |
| Operador | Fornecedor que trata dados em nome do controlador, quando aplicável. |
| Encarregado/DPO | Orienta, recebe solicitações e coordena decisões e comunicações de privacidade. |
| Administrador SGC | Mantém configurações técnicas, sem decidir sozinho base legal ou retenção. |
| Supervisor/Gerente | Controla necessidade operacional e aprova acessos dentro da política. |
| Usuário operacional | Acessa somente dados necessários à carteira e à tarefa atribuída. |

## 3. Inventário implementado

O módulo **Configurações SGC > LGPD e retenção** mantém registros persistentes para:

- identificação do cliente;
- dados de contato;
- contratos e débitos;
- atendimentos e mensagens;
- comprovantes financeiros;
- auditoria e segurança;
- operação de campo;
- dossiê jurídico;
- incidentes de segurança.

Cada registro contém código imutável, categoria, dados pessoais, finalidade, base legal, origem, perfis de acesso, retenção em meses, destino final, status e justificativa da aprovação.

## 4. Bases legais

As bases iniciais são hipóteses para validação do encarregado e do jurídico, considerando especialmente obrigação legal ou regulatória, execução de contrato e exercício regular de direitos. A base deve ser definida por operação de tratamento, não genericamente para todo o sistema.

Nenhuma política pode ser marcada como aprovada sem prazo de retenção. Aprovação na interface deve registrar responsável, justificativa e referência do parecer ou decisão.

## 5. Matriz mínima de acesso

| Categoria | Acesso mínimo proposto |
|---|---|
| Identificação e dívida | Operador da carteira, supervisor, financeiro, gerente e administrador conforme necessidade. |
| Contato e mensagens | Operador da carteira e supervisor. |
| Comprovantes | Financeiro, supervisor e gerente. |
| Campo | Profissional designado recebe somente os dados necessários à visita. |
| Jurídico | Profissional designado após encaminhamento registrado. |
| Auditoria e incidentes | Administrador autorizado, gerente, encarregado, segurança e jurídico conforme o caso. |

Requisitos técnicos pendentes: autorização real no backend, mascaramento de CPF/telefone, restrição por carteira e trilha de leitura/exportação.

## 6. Retenção e término do tratamento

- A retenção indefinida não é aprovada por esta especificação.
- Cada categoria deve possuir prazo e fundamento documentados.
- Ao vencer o prazo, o destino será `ELIMINAR`, `ANONIMIZAR` ou `CONSERVAR_BLOQUEADO`.
- Conservação bloqueada só pode ser usada quando existir hipótese justificável e deve impedir uso operacional comum.
- Suspensão de eliminação por litígio, auditoria ou obrigação legal deve ser registrada com início, motivo, responsável e revisão.
- Exclusão e anonimização automáticas permanecem desabilitadas até que todas as políticas aplicáveis sejam aprovadas e o executor seja testado.

## 7. Solicitações do titular

Fluxo previsto:

1. Receber a solicitação em canal oficial.
2. Gerar protocolo e registrar tipo: confirmação, acesso, correção, anonimização, bloqueio, eliminação, portabilidade ou informação sobre compartilhamento.
3. Validar a identidade sem coletar dados excessivos.
4. Localizar dados por CPF em RBX, SGC, anexos, integrações e fornecedores.
5. Avaliar exceções e obrigações de conservação.
6. Executar e revisar a resposta.
7. Entregar por canal seguro e registrar evidências.

Requisitos técnicos pendentes: módulo de solicitações, exportação estruturada, correção coordenada com RBX e rotina de anonimização.

## 8. Exportação

- Exige finalidade, solicitante, responsável e protocolo.
- Deve respeitar carteira e papel.
- O arquivo deve conter somente os campos necessários.
- Comprovantes e mensagens não entram em relatórios gerais.
- A entrega deve utilizar canal seguro, prazo de expiração e proteção compatível com o risco.
- A criação e o download devem gerar eventos de auditoria sem gravar o conteúdo pessoal completo no log.

## 9. Segurança e logs

- Não registrar CPF, telefone, mensagens, tokens ou comprovantes completos em logs técnicos.
- Criptografar transporte e armazenamento de arquivos sensíveis.
- Segredos de integração ficam fora do código-fonte.
- Acesso administrativo deve usar autenticação forte.
- Consultas, exportações, alterações de política e ações privilegiadas devem ser auditadas.
- Ambientes de teste devem usar dados sintéticos ou anonimizados.

## 10. Incidentes

Fluxo previsto:

1. Registrar descoberta, sistemas, dados e titulares potencialmente afetados.
2. Conter e preservar evidências.
3. Avaliar confirmação, dados pessoais envolvidos e risco ou dano relevante.
4. Acionar encarregado, segurança, jurídico e representante do controlador.
5. Quando aplicável, comunicar ANPD e titulares em até três dias úteis.
6. Complementar informações, executar mitigação e registrar lições aprendidas.
7. Manter o registro do incidente pelo prazo mínimo regulatório de cinco anos.

## 11. Compartilhamentos

WhatsApp, telefonia, infraestrutura, equipe de campo, jurídico e outros fornecedores devem ser cadastrados antes do uso ampliado. O registro deve conter operador, finalidade, dados, país de tratamento, controles, contrato, suboperadores e procedimento de descarte.

## 12. Critérios de aceite

- Inventário acessível no menu e persistido no banco.
- Código da categoria imutável.
- Política não pode ser aprovada sem retenção positiva.
- Status pendente, aprovada ou rejeitada.
- Destino final explícito.
- Nenhuma exclusão automática enquanto houver política pendente.
- Base legal e matriz de acesso aprovadas pelo encarregado/jurídico.
- Exportações e leituras privilegiadas auditadas antes da ampliação de uso.
- Testes de anonimização comprovam irreversibilidade razoável.
- Plano de incidentes testado e responsáveis nomeados.

## 13. Backlog LGPD

| Prioridade | Entrega |
|---|---|
| P0 | Aprovar controlador, encarregado, bases legais, prazos e matriz de acesso. |
| P0 | Implementar autorização por papel e carteira no backend. |
| P0 | Remover dados pessoais de logs e proteger comprovantes. |
| P1 | Solicitações do titular e exportação segura. |
| P1 | Executor de retenção com simulação, aprovação e auditoria. |
| P1 | Registro e gestão de incidentes. |
| P2 | Mascaramento, revisão periódica de acesso e gestão de fornecedores. |
| P2 | Relatório de impacto quando indicado pelo risco do tratamento. |

## 14. Referências oficiais

- Lei nº 13.709/2018 — LGPD: https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709compilado.htm
- Regulamentações da ANPD: https://www.gov.br/anpd/pt-br/acesso-a-informacao/institucional/atos-normativos/regulamentacoes_anpd
- Comunicação de incidente de segurança: https://www.gov.br/anpd/pt-br/canais_atendimento/agente-de-tratamento/comunicado-de-incidente-de-seguranca-cis
