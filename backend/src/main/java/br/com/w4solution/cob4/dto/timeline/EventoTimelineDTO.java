package br.com.w4solution.cob4.dto.timeline;

import java.time.OffsetDateTime;

public record EventoTimelineDTO(
		Long id,
		String processoReferencia,
		String evento,
		String descricao,
		String autorNome,
		String autorIdentificador,
		OffsetDateTime criadoEm
) {
}
