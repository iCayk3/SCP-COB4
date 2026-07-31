package br.com.w4solution.cob4.dto.planejamento;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

public record FechamentoMensalDTO(
		Long id,
		String competencia,
		int versao,
		String status,
		BigDecimal valorRecuperado,
		long protocolosEncerrados,
		long promessasCriadas,
		long atendimentosRegistrados,
		OffsetDateTime geradoEm,
		String geradoPor,
		String observacao,
		java.math.BigDecimal totalPagamentos, java.math.BigDecimal totalEstornos,
		java.math.BigDecimal totalDescontos, java.math.BigDecimal totalJuros, java.math.BigDecimal totalMultas,
		long divergenciasAbertas, Long substituiId, java.time.OffsetDateTime aprovadoEm, String aprovadoPor
) {}
