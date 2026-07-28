# Glossário operacional único — SGC

## Regras de uso

- Este documento é a referência comum para operação, produto, desenvolvimento e auditoria.
- **Motivo** é uma classificação escolhida em catálogo controlado.
- **Observação** é texto complementar e nunca substitui o motivo.
- Códigos de motivos e eventos são permanentes. Um item fora de uso deve ser inativado, não excluído.
- O histórico registra o código e o nome vigentes no momento da ação.

## Unidade do processo

| Termo | Definição |
|---|---|
| Cliente | Pessoa identificada pelo CPF e que pode possuir um ou mais contratos. |
| Contrato | Relação contratual individual importada do RBX. |
| Protocolo de cobrança | Unidade operacional vinculada a exatamente um contrato. |
| Operação conjunta | Ação atômica aplicada a dois ou mais protocolos do mesmo cliente. Todos são alterados ou nenhum é. |
| Carteira | Conjunto de protocolos atribuídos a uma fila ou responsável. |
| Responsável | Usuário ou fila que deve executar a próxima ação do protocolo. |

## Estados do fluxo padrão

| Código | Significado |
|---|---|
| `NOVO` | Protocolo criado e aguardando o primeiro contato. |
| `EM_ATENDIMENTO` | Cliente respondeu e existe atendimento ativo. |
| `SEM_CONTATO` | Cadência prevista concluída sem contato efetivo. |
| `VISITA` | Encaminhado à equipe de campo. Permitido a partir da F4. |
| `RETIRADA` | Encaminhado para procedimento de retirada. Permitido a partir da F5. |
| `JURIDICO` | Encaminhado ao jurídico. Permitido na F6. |
| `ENCERRADO` | Fluxo finalizado com motivo controlado e histórico preservado. |

Estados adicionais podem ser configurados na tela de fluxos. O código identifica o estado; o nome é seu rótulo de exibição.

## Eventos de auditoria

| Código | Quando ocorre |
|---|---|
| `PROCESSO_ENCERRADO` | Encerramento manual do protocolo. |
| `ESTADO_ALTERADO` | Mudança manual, conjunta ou automática de estado. |
| `FLUXO_ATRIBUIDO` | Troca do fluxo associado ao protocolo. |
| `ATENDIMENTO_REGISTRADO` | Registro de atendimento e mensagens. |

## Filas e tarefas

| Termo | Definição |
|---|---|
| Fila de cobrança | Destino padrão dos protocolos ainda não distribuídos. |
| Tarefa de primeiro contato | Contato inicial por WhatsApp, com prazo de 30 minutos em horas corridas. |
| Tarefa de ligação | Ligação criada após uma semana sem resposta ao WhatsApp. |
| Próxima ação | Tarefa operacional criada no encerramento de um atendimento. |
| SLA | Prazo em horas corridas para execução da tarefa ou ação. |
| SLA vencido | Prazo ultrapassado sem conclusão da tarefa associada. |

## Faixas de atraso

As faixas são configuráveis no sistema. A classificação usa o título ativo vencido mais antigo do contrato.

| Código inicial | Padrão | Prioridade |
|---|---:|---|
| `F1_RECENTE` | 1–7 dias | Baixa |
| `F2_INICIAL` | 8–15 dias | Média |
| `F3_INTERMEDIARIO` | 16–30 dias | Alta |
| `F4_AVANCADO` | 31–60 dias | Alta |
| `F5_CRITICO` | 61–90 dias | Crítica |
| `F6_JURIDICO` | Acima de 90 dias | Crítica |

## Catálogos controlados de motivos

| Tipo | Uso |
|---|---|
| `MOVIMENTACAO` | Mudanças operacionais gerais do protocolo. |
| `ENCERRAMENTO` | Encerramento manual ou transição ao estado final. |
| `REABERTURA` | Reabertura futura por supervisor ou superior. |
| `VISITA` | Encaminhamento para equipe de campo. |
| `RETIRADA` | Encaminhamento para retirada. |
| `JURIDICO` | Encaminhamento jurídico. |
| `CANCELAMENTO_FECHAMENTO` | Cancelamento de uma versão aprovada do fechamento mensal. |

Cada item contém: tipo, código imutável, nome, descrição, situação ativo/inativo, ordem e indicador de observação obrigatória.

## Fechamento mensal

| Termo | Definição |
|---|---|
| Competência | Mês-calendário ao qual os resultados pertencem. |
| Corte | Dia 5 às 00:00, apurando a competência anterior. |
| Baixa | Data registrada no RBX; na ausência, data informada pelo operador com comprovante. |
| Versão do fechamento | Registro imutável de uma apuração mensal. |
| Cancelamento | Invalidação por supervisor, com motivo obrigatório e sem exclusão da versão anterior. |
| Substituição | Nova versão que sucede um fechamento cancelado. |

## Governança

- A administração dos catálogos fica em **Verificação SGC > Catálogos de motivos**.
- Motivos usados no histórico não são apagados; são inativados.
- Permissões por perfil permanecem provisórias até a aprovação da matriz RACI definitiva.
- Retenção indefinida permanece provisória e depende de validação formal de LGPD.
