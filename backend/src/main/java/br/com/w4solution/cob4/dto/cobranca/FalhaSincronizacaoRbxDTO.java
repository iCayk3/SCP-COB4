package br.com.w4solution.cob4.dto.cobranca;

import java.time.OffsetDateTime;

public record FalhaSincronizacaoRbxDTO(
		Long id, String origem, String status, int tentativas, int maxTentativas,
		OffsetDateTime criadaEm, OffsetDateTime proximaTentativaEm,
		OffsetDateTime ultimaTentativaEm, OffsetDateTime resolvidaEm, String mensagem) {
}
