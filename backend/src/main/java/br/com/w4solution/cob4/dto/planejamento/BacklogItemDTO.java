package br.com.w4solution.cob4.dto.planejamento;

import br.com.w4solution.cob4.domain.BacklogItem;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public record BacklogItemDTO(
		Long id, @NotBlank String codigo, @NotBlank String titulo, @NotBlank String descricao,
		@NotNull BacklogItem.Prioridade prioridade, @NotNull BacklogItem.Status status,
		String responsavel, @NotBlank String criterioAceite, @PositiveOrZero int ordem
) {
}
