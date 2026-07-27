package br.com.w4solution.cob4.dto.rbx;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record BoletosAbertos(
		@JsonAlias({"Valor", "valor", "ValorDocumento", "valorDocumento"}) double valor,
		@JsonAlias({"Cliente", "cliente", "Cliente_Codigo", "clienteCodigo"}) String cliente,
		@JsonAlias({"Vencimento", "vencimento", "DataVencimento", "dataVencimento"}) String vencimento
) {
}
