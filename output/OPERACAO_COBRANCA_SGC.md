# Operação de cobrança SGC

Status: baseline operacional aprovada para implementação. A matriz de permissões é provisória.

## 1. Unidade e visão do processo

- Cada contrato possui um protocolo por ciclo de inadimplência.
- Um cliente pode possuir vários protocolos ativos.
- O atendimento apresenta todos os protocolos ativos e a soma dos valores.
- Uma negociação pode envolver vários protocolos do mesmo cliente, exceto protocolos no jurídico.
- A operação conjunta é atômica, mas cada protocolo preserva fluxo, SLA, tarefas, valores e timeline próprios.
- Pagamento de um contrato não encerra os demais.

## 2. Mapa operacional

1. Às 04:00 e 20:45, o SGC consulta o RBX. Os horários são configuráveis.
2. Para cada contrato inadimplente sem protocolo ativo no ciclo, o sistema cria um protocolo.
3. Protocolos do mesmo cliente ficam preferencialmente com o mesmo operador.
4. O protocolo recebe tarefa de contato por WhatsApp com prazo de 30 minutos.
5. Sem resposta, o sistema agenda uma tentativa por ligação para sete dias depois.
6. Sem sucesso na ligação, o protocolo segue para `SEM_CONTATO`.
7. Com resposta, o operador registra atendimento, próxima ação e pode iniciar negociação.
8. Em negociação conjunta, valores de entrada, desconto e parcelas são rateados proporcionalmente.
9. O operador pode retirar protocolos da seleção antes da confirmação.
10. O operador pode encaminhar o protocolo para a equipe de campo.
11. A visita registra localização, foto, observação e estado resultante.
12. Retirada segue critérios configuráveis. A chegada ao estado `RETIRADA` representa autorização prévia.
13. Somente supervisor ou superior encaminha ao jurídico; operador comum não negocia protocolo no jurídico.
14. Pagamento integral confirmado encerra automaticamente o protocolo.
15. Acordo mantém o protocolo aberto até quitação.
16. Encerramento manual e reabertura são permitidos para supervisor ou superior. Reabertura exige motivo.
17. Novo atraso do mesmo contrato após encerramento cria novo ciclo e novo protocolo.

## 3. RACI provisória

Legenda: R executa; A responde/aprova; C é consultado; I é informado.

| Atividade | Operador | Supervisor | Financeiro | Campo | Jurídico | Gerente | Administrador |
|---|---|---|---|---|---|---|---|
| Primeiro contato e atendimento | R | A | I | I | I | I | I |
| Negociação padrão | R | A | C | I | I | I | I |
| Aprovação de desconto | R, dentro da alçada | R/A | R/A | I | I | R/A | R/A |
| Distribuição automática | I | A | I | I | I | I | C |
| Redistribuição entre operadores | I | R/A | I | I | I | I | C |
| Encaminhamento para campo | R | A | I | I | I | I | I |
| Execução da visita | I | A | I | R | I | I | I |
| Encaminhamento jurídico | I | R | C | I | R | A | I |
| Confirmação de pagamento | I | I | R | I | I | A | I |
| Encerramento/reabertura manual | I | R | C | I | C | A | I |
| Fechamento mensal | I | R/A | C | I | I | I | I |
| Administração técnica e logs | I | I | I | I | I | I | R/A |

## 4. Distribuição

- Distribuição automática por faixa de atraso e equilíbrio aproximado da quantidade de protocolos.
- Protocolos do mesmo cliente devem permanecer, preferencialmente, com o mesmo operador.
- Operador indisponível não recebe protocolos novos.
- Supervisor possui ação para distribuir automaticamente os protocolos sem responsável entre operadores online.
- Ausência de movimentação alerta o supervisor, mas não redistribui automaticamente.
- Operador pode devolver ou solicitar transferência em qualquer situação.
- Motivo de redistribuição não é obrigatório; a ação e seus participantes continuam auditados.
- Cadastro de operadores, presença online e faixas ainda dependem do módulo de usuários.

## 5. Descontos

- Percentuais são configuráveis por perfil.
- O limite não varia por faixa de atraso.
- O desconto pode incidir sobre principal, juros e multa.
- Operador atua até sua alçada. Acima dela, a aprovação acontece dentro do sistema.
- Supervisor, financeiro, gerente e administrador possuem alçadas configuráveis.
- Não há proibição absoluta de desconto, respeitada a alçada.

## 5.1 Faixas de atraso

A faixa usa o título ativo mais antigo do protocolo e é recalculada em cada sincronização.

| Faixa | Dias | Prioridade | Tratamento |
|---|---:|---|---|
| F1 — Recente | 1–7 | Baixa | WhatsApp e abordagem amigável |
| F2 — Inicial | 8–15 | Média | Ligação e reforço da pendência |
| F3 — Intermediário | 16–30 | Alta | Negociação ativa e acompanhamento |
| F4 — Avançado | 31–60 | Alta | Negociação e possibilidade de visita |
| F5 — Crítico | 61–90 | Crítica | Campo, retirada ou supervisão |
| F6 — Jurídico | Acima de 90 | Crítica | Avaliação e encaminhamento pelo supervisor/gerente |

- A visita somente é permitida a partir de 31 dias.
- A retirada somente é permitida a partir de 61 dias.
- O encaminhamento jurídico somente é permitido acima de 90 dias.
- A progressão da faixa não movimenta o estado automaticamente; ela altera prioridade e habilita ações.

## 6. SLA

- Primeiro contato: 30 minutos após a criação.
- Cadência sem resposta: ligação sete dias após o WhatsApp.
- SLA é contado em horas corridas, inclusive finais de semana e feriados.
- `AGUARDANDO` pagamento pausa o SLA operacional.
- Alertas antes/depois do vencimento serão configuráveis.

## 7. Encerramento

- Pagamento integral confirmado encerra automaticamente.
- Protocolo não pode ser encerrado com saldo.
- Acordo não encerra antes da quitação.
- Encerramento pago exige comprovante e observação.
- Outros encerramentos exigem motivo configurado e observação.
- Reabertura exige motivo e preserva o histórico.
- Fechamentos e timelines são append-only; correções geram novos eventos.

## 8. Fechamento mensal

- A competência é o mês-calendário, do primeiro ao último dia.
- O fechamento é executado no dia 5 às 00:00, horário de Brasília, para a competência anterior.
- A data oficial é a baixa no RBX.
- Sem baixa, usa-se a data informada pelo operador com comprovante.
- Pagamento retroativo exige data selecionada e comprovante.
- Estorno reabre o protocolo.
- Fechamento aprovado não é apagado: supervisor cancela com motivo e gera uma nova versão.
- Versões anteriores permanecem auditáveis.
- Indicadores: valor recuperado, protocolos encerrados, promessas, produtividade, descontos, retroativos e estornos.
- Saídas: resumo PDF e detalhamento Excel/CSV.

## 9. Privacidade e pendências

- Retenção permanente é provisória e depende de validação LGPD.
- Exportação: supervisor ou superior.
- Logs completos: administrador.
- Mascaramento e matriz final de permissões permanecem pendentes.

## 10. Backlog técnico

1. Cadastro de usuários, papéis, alçadas e presença online.
2. Motor configurável de distribuição por faixa e carga.
3. Integração real de WhatsApp e telefonia.
4. Negociação financeira, rateio, parcelas e aprovação.
5. Módulo de campo com evidências.
6. Catálogo configurável de encerramento e retirada.
7. Baixa/estorno RBX e comprovantes.
8. Fechamento mensal versionado e exportações.
9. Autorização no backend e mascaramento.
10. Política LGPD aprovada.
