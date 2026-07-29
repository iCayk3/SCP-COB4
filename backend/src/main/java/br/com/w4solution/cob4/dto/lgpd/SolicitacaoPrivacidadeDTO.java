package br.com.w4solution.cob4.dto.lgpd;

import jakarta.validation.constraints.NotBlank;

public record SolicitacaoPrivacidadeDTO(
		@NotBlank String cpf, @NotBlank String motivo, String confirmacao
) {}
