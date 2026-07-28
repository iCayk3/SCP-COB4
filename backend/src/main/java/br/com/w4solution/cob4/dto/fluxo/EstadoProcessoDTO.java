package br.com.w4solution.cob4.dto.fluxo;

import java.time.OffsetDateTime;
import java.util.List;

public record EstadoProcessoDTO(
		String fluxoCodigo,
		String fluxoNome,
		String estadoCodigo,
		String estadoNome,
		OffsetDateTime desde,
		List<DestinoDTO> destinos
) {
	public record DestinoDTO(String codigo, String nome, String transicao) {}
}
