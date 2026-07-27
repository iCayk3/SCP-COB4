package br.com.w4solution.cob4.dto.rbx;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record ContratoRbxDTO(
		@JsonAlias({"Numero", "numero"}) String numero,
		@JsonAlias({"ValorLiquido", "valorLiquido"}) String valorLiquido,
		@JsonAlias({"ValorBruto", "valorBruto", "Valor", "valor"}) String valorBruto
) {
}
