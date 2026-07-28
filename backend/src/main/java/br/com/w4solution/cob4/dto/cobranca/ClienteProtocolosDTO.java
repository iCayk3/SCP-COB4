package br.com.w4solution.cob4.dto.cobranca;

import java.math.BigDecimal;
import java.util.List;

public record ClienteProtocolosDTO(
		String cpf,
		String cliente,
		BigDecimal valorTotal,
		List<CobrancaResumoDTO> protocolos
) {
}
