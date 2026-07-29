package br.com.w4solution.cob4.dto.cobranca;

import java.util.List;

public record DistribuicaoCarteiraDTO(
		List<String> operadorIdentificadores,
		String motivo
) {}
