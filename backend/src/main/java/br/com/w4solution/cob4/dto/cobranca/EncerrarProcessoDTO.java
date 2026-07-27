package br.com.w4solution.cob4.dto.cobranca;

import jakarta.validation.constraints.NotBlank;

public record EncerrarProcessoDTO(
		@NotBlank String motivo,
		@NotBlank String operadorNome,
		@NotBlank String operadorIdentificador
) {
}
