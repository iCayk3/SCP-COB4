package br.com.w4solution.cob4.dto.cliente;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record ClienteRbxDTO(
		@JsonAlias({"Codigo", "codigo"}) String codigo,
		@JsonAlias({"Nome", "nome", "RazaoSocial", "razaoSocial"}) String nome,
		@JsonAlias({"TelComercial", "telComercial", "TelefoneComercial"}) String telComercial,
		@JsonAlias({"TelResidencial", "telResidencial", "TelefoneResidencial"}) String telResidencial,
		@JsonAlias({"TelCelular", "telCelular", "Celular"}) String telCelular,
		@JsonAlias({"Endereco", "endereco"}) String endereco,
		@JsonAlias({"Numero", "numero"}) String numero,
		@JsonAlias({"Complemento", "complemento"}) String complemento,
		@JsonAlias({"Bairro", "bairro"}) String bairro,
		@JsonAlias({"Cidade", "cidade"}) String cidade,
		@JsonAlias({"UF", "Uf", "uf"}) String uf,
		@JsonAlias({"CEP", "Cep", "cep"}) String cep,
		@JsonAlias({"Grupo", "grupo"}) String grupo,
		@JsonAlias({"Situacao", "situacao"}) String situacao,
		@JsonAlias({"CPF_CNPJ", "CpfCnpj", "cpfCnpj", "CPF", "Cpf", "cpf", "CNPJ", "Cnpj", "cnpj"}) String cpfCnpj,
		@JsonAlias({"Email", "email", "E_mail", "e_mail"}) String email
) {
}
