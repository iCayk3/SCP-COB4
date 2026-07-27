package br.com.w4solution.cob4.dto.regra;

import java.util.List;

public record RegraNegocioDTO(
		String modulo,
		String codigo,
		String nome,
		String descricao,
		String tipo,
		String prioridade,
		String eventoDisparador,
		List<String> acoes,
		List<String> excecoes
) {
}
