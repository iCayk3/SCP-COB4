package br.com.w4solution.cob4.dto.cobranca;

import jakarta.validation.constraints.NotBlank;

public record EncerrarProcessoDTO(
		@NotBlank String motivoCodigo,
		String observacao
) {
}
