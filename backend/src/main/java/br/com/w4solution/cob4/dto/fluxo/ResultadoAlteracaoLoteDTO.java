package br.com.w4solution.cob4.dto.fluxo;

import java.util.List;

public record ResultadoAlteracaoLoteDTO(
		String operacaoId,
		List<String> referencias,
		String destino
) {
}
