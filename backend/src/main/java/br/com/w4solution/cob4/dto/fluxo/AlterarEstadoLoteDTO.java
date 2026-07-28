package br.com.w4solution.cob4.dto.fluxo;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record AlterarEstadoLoteDTO(
		@NotEmpty List<@NotBlank String> referencias,
		@NotBlank String destino,
		@NotBlank String operadorNome,
		@NotBlank String operadorIdentificador,
		@NotBlank String motivoCodigo,
		String observacao
) {
}
