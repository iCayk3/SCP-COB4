package br.com.w4solution.cob4.dto.fluxo;

import jakarta.validation.constraints.NotBlank;

public record AtribuirFluxoDTO(
		@NotBlank String fluxoCodigo,
		@NotBlank String operadorNome,
		@NotBlank String operadorIdentificador
) {
}
