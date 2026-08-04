# Implementação da Área de Trabalho no frontend

Data da validação: 04/08/2026

## Objetivo

Preparar a entrada autenticada do SGC para testes de usabilidade, substituindo o dashboard genérico do template por informações operacionais reais sem alterar o design-base Material UI da aplicação.

## Entregas

- Dashboard inicial conectado ao endpoint `GET /api/area-trabalho`.
- Saudação personalizada para o usuário autenticado.
- Indicadores de carteira, tarefas atrasadas, promessas do dia, valor da carteira e SLAs críticos.
- Destaque da próxima atividade com prazo, protocolo e prioridade.
- Resumo diário de atendimentos, contatos efetivos, negociações e taxa de efetividade.
- Lista de alertas críticos da carteira.
- Estados visuais de carregamento, atualização, erro, ausência de tarefas e ausência de alertas.
- Menu principal alterado de `Visão geral` para `Área de trabalho`.
- Tela de cobranças alterada para consumir `GET /api/cobrancas/minha-fila/pagina`, respeitando a sessão autenticada.
- Menu `Acompanhamento de processos` com lista operacional, busca com atraso controlado e paginação executada no backend.
- O acompanhamento seleciona o escopo pelo perfil: administrador, gerente e supervisor consultam a operação completa; operador consulta somente a própria carteira.
- Indicadores da lista distinguem o total da carteira dos valores calculados apenas sobre a página exibida.
- Botões do tema receberam mais espaçamento interno e cantos com raio menor para melhorar legibilidade e ergonomia.
- Correção das diretivas ESLint inválidas que impediam a validação estática.

## Validação executada

- `npm run api:check`: aprovado.
- `npm run lint`: aprovado.
- `npm run build`: aprovado, com 3.172 módulos transformados.

## Paginação operacional

A tela envia `pagina`, `tamanho`, `busca`, `ordenarPor` e `direcao` ao endpoint da fila da sessão. A busca aguarda 400 ms após a digitação para evitar requisições excessivas.
