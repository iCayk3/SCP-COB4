package br.com.w4solution.cob4.dto.cobranca;

import java.util.List;

public record PaginaCobrancaDTO(
		List<CobrancaResumoDTO> itens,
		int pagina,
		int tamanho,
		long totalElementos,
		int totalPaginas,
		boolean primeira,
		boolean ultima
) {
}
