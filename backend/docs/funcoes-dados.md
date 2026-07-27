# Funcoes de dados do sistema

Este documento descreve as funcoes de integracao pelo ponto de vista do nosso sistema.
A fonte atual e a RBXSoft, mas o codigo e a documentacao devem sempre separar:

- funcao do sistema: o que o nosso backend precisa fazer.
- fonte de dados: fornecedor atual da informacao ou acao.
- servico do provider: nome tecnico usado pela fonte atual.

Hoje existem duas fontes RBX configuradas:

- `rbx-v1`: API legada atual, configurada por `RBX_API_URL`.
- `rbx-v2`: API nova, configurada por `RBX_API_V2_URL`. Se essa URL nao for informada, o backend tenta derivar a URL v2 a partir de `RBX_API_URL`, trocando `/routerbox/ws/rbx_server_json.php` por `/routerbox/ws_json/ws_json.php`.

A chave fica em `RBX_API_KEY`.

## Catalogos consultaveis

Use estes endpoints para ver o que esta disponivel sem abrir o codigo:

Tambem existe documentacao interativa gerada pelo springdoc-openapi:

```http
GET /swagger-ui.html
GET /api-docs
GET /api-docs.yaml
```

Use a Swagger UI para navegar e testar os endpoints do backend. Use este markdown para entender a regra de negocio
e a separacao entre funcao do sistema e fonte/provider.

```http
GET /api/rbx/v1/servicos
GET /api/rbx/v1/servicos/{servicoProvider}
```

```http
GET /api/rbx/v2/funcoes
GET /api/rbx/v2/funcoes/provider/{servicoProvider}
GET /api/rbx/v2/funcoes/sistema/{funcaoSistema}
```

Na v2, o catalogo retorna campos pensados para troca futura de fonte:

```json
{
  "moduloSistema": "Financeiro",
  "funcaoSistema": "financeiro.gerarLinhaDigitavel",
  "acaoSistema": "Gerar linha digitavel de boleto",
  "fonteDados": "rbx-v2",
  "servicoProvider": "get_barcode",
  "payloadRaiz": "get_barcode",
  "observacao": null
}
```

Se no futuro a fonte de dados deixar de ser RBX, preserve `funcaoSistema` e adapte apenas `fonteDados`,
`servicoProvider` e o executor correspondente.

## Execucao RBX v1

A v1 usa autenticacao dentro do corpo. O backend injeta essa autenticacao automaticamente.

Forma por servico:

```http
POST /api/rbx/v1/ConsultaClientes
Content-Type: application/json

{
  "filtro": "Situacao = 'B'"
}
```

Forma igual ao provider:

```http
POST /api/rbx/v1
Content-Type: application/json

{
  "ConsultaDocumentosAbertos": {
    "Filtro": "Historico = 'Documento a Receber'"
  }
}
```

Use a v1 principalmente para compatibilidade com os fluxos existentes. Para detalhes historicos da v1,
veja `backend/docs/rbx-v1.md`.

## Execucao RBX v2

A v2 usa o header `authentication_key`. O backend injeta esse header automaticamente.

Forma por servico:

```http
POST /api/rbx/v2/get_barcode
Content-Type: application/json

{
  "document_id": 12345
}
```

O backend envia para a RBX:

```json
{
  "get_barcode": {
    "document_id": 12345
  }
}
```

Forma igual ao provider:

```http
POST /api/rbx/v2
Content-Type: application/json

{
  "get_unpaid_document": {
    "customer_id": 10
  }
}
```

Servicos cujo payload raiz e uma lista tambem sao suportados:

```http
POST /api/rbx/v2/files_upload
Content-Type: application/json

[
  {
    "file_name": "contrato.pdf",
    "file_content": "base64..."
  }
]
```

## Modulos v2 catalogados

O catalogo v2 cobre as funcoes documentadas pela RBX em 25 de julho de 2026:

- Atendimento: alteracao, designacao, encerramento, agendamentos, checklist, OS, mensagens, ocorrencias e pesquisa de satisfacao.
- Autenticacao: cadastrar, alterar e excluir autenticacoes.
- Cliente: contatos, grupos, IP, clientes on-line, equipamentos, dados adicionais, Cobrador Virtual e TIP MVNO.
- Contrato: inclusao, alteracao, bloqueio, desbloqueio, cancelamento, ativacao, assinatura, transferencia, suspensao temporaria, degustacao, enderecos e descontos promocionais.
- Estoque: produtos, modelos, tipos, locacoes, comodato e movimentacoes.
- Financeiro: documentos, baixas, reversoes, boletos, linha digitavel, Pix, notas fiscais, cartoes, pre-faturamento e avisos.
- Operacao: campos complementares, radius, provisionamento, pedidos, SMS, pacotes, contas TIP, upload de arquivos e acesso a Central do Assinante.

Para a lista exata e atualizada no codigo em execucao, use `GET /api/rbx/v2/funcoes`.

## Regra para novas fontes de dados

Quando outra fonte substituir ou complementar a RBX:

1. Mantenha o nome da funcao do sistema quando o comportamento for o mesmo.
2. Crie um novo catalogo com `fonteDados` diferente, por exemplo `ixc`, `hubsoft` ou `interno`.
3. Nao exponha chaves ou tokens no corpo recebido pelo frontend.
4. Documente exemplos usando primeiro a funcao do sistema e depois o nome tecnico do provider.
5. Se o payload do provider for muito diferente, crie um DTO interno e faca a traducao no service da fonte.

Essa regra evita que o resto do backend fique acoplado aos nomes tecnicos da RBX.
