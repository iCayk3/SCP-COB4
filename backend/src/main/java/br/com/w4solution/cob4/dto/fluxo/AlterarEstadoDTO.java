package br.com.w4solution.cob4.dto.fluxo;

import jakarta.validation.constraints.NotBlank;

public record AlterarEstadoDTO(
		@NotBlank String destino,
		@NotBlank String operadorNome,
		@NotBlank String operadorIdentificador,
		@NotBlank String motivoCodigo,
		String observacao
) {
}
