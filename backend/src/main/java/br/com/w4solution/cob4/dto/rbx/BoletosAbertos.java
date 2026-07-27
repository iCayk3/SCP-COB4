package br.com.w4solution.cob4.dto.rbx;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record BoletosAbertos(
		@JsonAlias({"Valor", "valor", "ValorDocumento", "valorDocumento"}) double valor,
		@JsonAlias({"Cliente", "cliente", "Cliente_Codigo", "clienteCodigo", "CliFor", "cliFor", "CliFlor", "cliFlor"}) String cliente,
		@JsonAlias({"Vencimento", "vencimento", "DataVencimento", "dataVencimento"}) String vencimento,
		@JsonAlias({"Documento", "documento", "Codigo", "codigo", "Documento_Codigo", "documentoCodigo"}) String documento,
		@JsonAlias({"Contrato", "contrato", "Contrato_Numero", "contratoNumero"}) String contrato,
		@JsonAlias({"ContratosVinculados", "contratosVinculados"}) String contratosVinculados,
		@JsonAlias({"Nome", "nome", "RazaoSocial", "razaoSocial"}) String nome,
		@JsonAlias({"CPF_CNPJ", "CpfCnpj", "cpfCnpj", "CPF", "Cpf", "cpf"}) String cpfCnpj,
		@JsonAlias({"Telefone1", "telefone1"}) String telefone1,
		@JsonAlias({"Telefone2", "telefone2"}) String telefone2,
		@JsonAlias({"Telefone3", "telefone3"}) String telefone3,
		@JsonAlias({"Conta", "conta"}) String conta,
		@JsonAlias({"Sequencia", "sequencia"}) String sequencia
) {
}
