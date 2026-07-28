package br.com.w4solution.cob4.dto.cobranca;

import br.com.w4solution.cob4.domain.Cobranca;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record FaixaAtrasoConfigDTO(
		Long id,
		@NotBlank String codigo,
		@NotBlank String nome,
		@Min(1) int ordem,
		@Min(1) int diasInicio,
		@Min(1) Integer diasFim,
		@NotNull Cobranca.Prioridade prioridade
) {
}
