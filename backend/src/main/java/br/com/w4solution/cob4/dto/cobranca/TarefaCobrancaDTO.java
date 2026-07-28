package br.com.w4solution.cob4.dto.cobranca;

import java.time.OffsetDateTime;

public record TarefaCobrancaDTO(
		Long id,
		String referencia,
		String clienteNome,
		String tipo,
		String titulo,
		String status,
		String prioridade,
		String responsavelNome,
		String responsavelIdentificador,
		OffsetDateTime prazoEm,
		OffsetDateTime criadaEm
) {}
