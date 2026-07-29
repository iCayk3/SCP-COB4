package br.com.w4solution.cob4.dto.cobranca;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PausaSlaDTO(
		@NotBlank @Size(max = 500) String motivo
) {}
