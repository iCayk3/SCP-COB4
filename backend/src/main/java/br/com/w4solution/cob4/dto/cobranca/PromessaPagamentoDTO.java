package br.com.w4solution.cob4.dto.cobranca;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;

public record PromessaPagamentoDTO(
		Long id,
		String referencia,
		BigDecimal valor,
		LocalDate vencimento,
		String status,
		String operadorNome,
		String operadorIdentificador,
		String observacao,
		OffsetDateTime criadaEm,
		OffsetDateTime atualizadaEm
) {}
