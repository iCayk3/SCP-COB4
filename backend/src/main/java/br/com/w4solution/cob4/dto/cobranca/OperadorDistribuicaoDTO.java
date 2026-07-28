package br.com.w4solution.cob4.dto.cobranca;

import jakarta.validation.constraints.NotBlank;

public record OperadorDistribuicaoDTO(
		@NotBlank String nome,
		@NotBlank String identificador,
		boolean online
) {}
