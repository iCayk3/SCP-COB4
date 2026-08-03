package br.com.w4solution.cob4.dto.atendimento;

import java.time.OffsetDateTime;
import java.util.List;

public record AtendimentoResumoDTO(
		Long id, String canal, String resultado, String observacao, String proximaAcao,
		String operadorNome, String operadorIdentificador, OffsetDateTime realizadoEm,
		List<MensagemResumoDTO> mensagens, Integer duracaoSegundos, OffsetDateTime retornoAgendadoEm,
		Long promessaId, Long acordoId, Long agendamentoId
) {
	public record MensagemResumoDTO(Long id, String autor, String mensagem, OffsetDateTime enviadaEm) {}
}
