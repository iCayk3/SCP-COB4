package br.com.w4solution.cob4.dto.cliente;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record BoletosBaixadosRbxDTO(
		@JsonAlias({"CodigoPessoa", "codigoPessoa", "Cliente", "cliente"})
		String codigoPessoa,

		@JsonAlias({"ValorBaixado", "valorBaixado", "Valor", "valor"})
		String valorBaixado
) {
}
