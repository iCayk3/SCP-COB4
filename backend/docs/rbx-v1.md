# Integracao RBX v1

Esta e a documentacao tecnica da fonte de dados `rbx-v1`.
Para a visao por funcoes do nosso sistema, consulte `backend/docs/funcoes-dados.md`.

Esta integracao encapsula os servicos v1 da RBXSoft documentados em:

https://developers.rbxsoft.com/#servicos-v1-0

Na v1 da RBX, todos os servicos usam `POST` no endpoint configurado em `RBX_API_URL`.
A chave de integracao fica somente no backend, configurada em `RBX_API_KEY`, e e enviada no campo
`Autenticacao.ChaveIntegracao`.

## Configuracao

As propriedades atuais ficam em `src/main/resources/application.properties`:

```properties
api.service.integration.rbx=${RBX_API_URL:}
api.service.integration.rbx.chave=${RBX_API_KEY:}
```

`RBX_API_URL` deve apontar para o endpoint v1 da RBX, normalmente:

```text
https://[minha_url]/routerbox/ws/rbx_server_json.php
```

## Endpoints internos

### Listar servicos disponiveis

```http
GET /api/rbx/v1/servicos
```

Retorna o catalogo local com os servicos v1 documentados, agrupados por area, com o nome do servico RBX,
indicacao de suporte a `Filtro` e o nome do payload principal quando existir.

### Consultar um servico no catalogo

```http
GET /api/rbx/v1/servicos/ConsultaClientes
```

Retorna metadados de um servico especifico ou `404` se ele nao estiver no catalogo local.

### Executar por nome do servico

```http
POST /api/rbx/v1/ConsultaClientes
Content-Type: application/json

{
  "filtro": "Situacao = 'B'"
}
```

O backend monta o JSON esperado pela RBX:

```json
{
  "ConsultaClientes": {
    "Autenticacao": {
      "ChaveIntegracao": "[RBX_API_KEY]"
    },
    "Filtro": "Situacao = 'B'"
  }
}
```

### Executar no formato da documentacao RBX

```http
POST /api/rbx/v1
Content-Type: application/json

{
  "ConsultaClientes": {
    "Filtro": "Codigo = '10'"
  }
}
```

Esse formato aceita qualquer campo previsto pelo servico RBX. Caso venha `Autenticacao` ou `ChaveIntegracao`
no corpo, o backend ignora e substitui pela chave configurada no servidor.

## Filtros futuros

Para servicos de consulta, a RBX v1 aceita o campo `Filtro` como a clausula de filtro suportada pelo proprio RBX.
Por isso, novos filtros documentados pela RBX em servicos existentes nao exigem alteracao de codigo:

```http
POST /api/rbx/v1/ConsultaDocumentosAbertos
Content-Type: application/json

{
  "filtro": "Historico = 'Documento a Receber' AND Vencimento < '2026-07-25'"
}
```

Importante: o backend nao tenta interpretar nem reescrever o `Filtro`; ele repassa para a RBX. Use somente filtros
compatíveis com os campos documentados pela RBX para cada servico.

## Payloads com dados

Alguns servicos nao usam `Filtro`; eles recebem grupos de dados definidos pela documentacao.

Exemplo com cadastro de atendimento:

```http
POST /api/rbx/v1/AtendimentoCadastro
Content-Type: application/json

{
  "DadosAtendimento": {
    "Data_Abertura": "2026-07-25",
    "Hora_Abertura": "10:00:00",
    "Iniciativa": "C",
    "Modo": "T",
    "TipoCliente": "C",
    "Cliente": "1",
    "Contrato": "7480",
    "Prioridade": "1",
    "Situacao": "A",
    "Tipo": "T",
    "Topico": "2",
    "Assunto": "Sem internet",
    "Usuario_Abertura": "routerbox"
  }
}
```

Exemplo com linha digitavel:

```http
POST /api/rbx/v1/ConsultaLinhaDigitavelBoleto
Content-Type: application/json

{
  "DadosLinhaDigitavelEntrada": {
    "Tipo": "C",
    "CliFor": 1,
    "Documento": 12345
  }
}
```

Tambem existe a forma curta com `dados`, util quando o nome do grupo nao importa para o chamador. Para servicos que
exigem um grupo nomeado pela RBX, prefira enviar o nome exato do grupo, como `DadosAtendimento`.

## Catalogo atual

O catalogo fica em `RbxV1CatalogoService` e serve apenas para consulta/documentacao. A execucao generica nao bloqueia
servicos fora do catalogo, desde que o nome seja valido, para permitir uso emergencial de servicos novos da RBX.

Servicos catalogados:

| Grupo | Servico RBX | Filtro | Payload principal |
| --- | --- | --- | --- |
| Atendimentos | AtendimentoCadastro | Nao | DadosAtendimento |
| Atendimentos | ConsultaAtendimentos | Sim | - |
| Atendimentos | ConsultaCausas | Sim | - |
| Atendimentos | ConsultaChecklistAtendimentos | Sim | - |
| Atendimentos | ConsultaFluxos | Sim | - |
| Atendimentos | ConsultaGruposSLA | Nao | - |
| Atendimentos | ConsultaOcorrenciasAtendimentos | Sim | - |
| Atendimentos | ConsultaTopicos | Sim | - |
| Autenticacoes | ConsultaAutenticacao | Sim | - |
| Autenticacoes | ConsultaAutenticacaoSenha | Sim | - |
| Clientes | ClienteAlteracao | Nao | DadosCliente |
| Clientes | MercadoAlteracao | Nao | DadosMercado |
| Clientes | ClienteCadastro | Nao | DadosCliente |
| Clientes | MercadoCadastro | Nao | DadosMercado |
| Clientes | ConsultaClientes | Sim | - |
| Clientes | ConsultaClientesBloqueados | Sim | - |
| Clientes | ConsultaClientesReducao | Sim | - |
| Clientes | ConsultaClienteOnline | Sim | - |
| Clientes | ConsultaComplementoContatos | Nao | - |
| Clientes | ConsultaContatos | Sim | - |
| Clientes | ConsultarDadosAdicionais | Sim | - |
| Clientes | ConsultaClientesCobranca | Sim | - |
| Clientes | ConsultaEquipamentosOnline | Sim | - |
| Clientes | ConsultaGruposCliente | Nao | - |
| Clientes | ConsultaMercados | Sim | - |
| Contratos | ConsultaConcorrencia | Nao | - |
| Contratos | ConsultaContratos | Sim | - |
| Contratos | ConsultaContratosBloqueados | Sim | - |
| Contratos | ConsultaMotivosCancelamento | Nao | - |
| Estoque | ConsultaModelosProduto | Sim | - |
| Estoque | ConsultaTiposProduto | Sim | - |
| Estoque | ConsultaUnidadesProduto | Sim | - |
| Financeiro | NotasFiscaisCadastro | Nao | DadosNota |
| Financeiro | ConsultaCartoesCadastrados | Sim | - |
| Financeiro | ConsultaCiclosFaturamento | Nao | - |
| Financeiro | ConsultaDocumentosBaixados | Sim | - |
| Financeiro | ConsultaDocumentosAbertos | Sim | - |
| Financeiro | ConsultaGruposCobranca | Nao | - |
| Financeiro | ConsultaLinhaDigitavelBoleto | Nao | DadosLinhaDigitavelEntrada |
| Variados | PedidoCadastro | Nao | DadosPedido |
| Variados | ConsultaDadosAdicionais | Nao | - |
| Variados | FailOverEvents | Sim | - |
| Variados | ConsutaFornecedores | Sim | - |
| Variados | ConsultaPlanos | Nao | - |
| Variados | ConsultaQoS | Nao | - |
| Variados | ConsultaStatusNAS | Sim | - |
| Variados | ConsultaUsuarios | Nao | - |
