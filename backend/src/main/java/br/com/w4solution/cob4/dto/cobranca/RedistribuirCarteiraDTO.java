package br.com.w4solution.cob4.dto.cobranca;

import jakarta.validation.constraints.NotBlank;

public record RedistribuirCarteiraDTO(
		@NotBlank String operadorIdentificador,
		@NotBlank String motivo
) {}
