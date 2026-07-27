package br.com.w4solution.cob4.dto.cobranca;

import java.math.BigDecimal;

public record SincronizacaoCobrancaDTO(
		int documentosRecebidos,
		int documentosVencidos,
		int documentosIgnorados,
		int cobrancasCriadas,
		int boletosCriados,
		int boletosAtualizados,
		BigDecimal valorTotalProcessado
) {
}
