package br.com.w4solution.cob4.dto.rbx;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record ClientesInadiplentesRbxDTO(
		@JsonAlias({"Codigo", "codigo", "Cliente", "cliente"}) String codigo,
		@JsonAlias({"Motivo", "motivo", "Descricao", "descricao"}) String motivo
) {
}
