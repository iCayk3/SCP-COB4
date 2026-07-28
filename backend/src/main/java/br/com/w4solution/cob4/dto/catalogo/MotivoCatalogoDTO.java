package br.com.w4solution.cob4.dto.catalogo;

import br.com.w4solution.cob4.domain.MotivoCatalogo;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public record MotivoCatalogoDTO(
		Long id,
		@NotNull MotivoCatalogo.Tipo tipo,
		@NotBlank String codigo,
		@NotBlank String nome,
		String descricao,
		boolean ativo,
		@PositiveOrZero int ordem,
		boolean exigeObservacao
) {
}
