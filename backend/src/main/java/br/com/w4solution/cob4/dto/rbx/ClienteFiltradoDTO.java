package br.com.w4solution.cob4.dto.rbx;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record ClienteFiltradoDTO(
		@JsonAlias({"Codigo", "codigo"}) String codigo,
		@JsonAlias({"Nome", "nome", "RazaoSocial", "razaoSocial"}) String nome
) {
}
