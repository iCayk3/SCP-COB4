package br.com.w4solution.cob4.dto.cobranca;

import java.time.OffsetDateTime;

public record SincronizacaoRbxExecucaoDTO(
		Long id,
		String chaveIdempotencia,
		String origem,
		String status,
		OffsetDateTime iniciadaEm,
		OffsetDateTime finalizadaEm,
		long duracaoMs,
		Integer documentosRecebidos,
		Integer vencidos,
		Integer cobrancasCriadas,
		Integer boletosCriados,
		String mensagem
) {}
