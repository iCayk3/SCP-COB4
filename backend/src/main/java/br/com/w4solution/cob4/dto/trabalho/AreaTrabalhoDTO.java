package br.com.w4solution.cob4.dto.trabalho;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

public record AreaTrabalhoDTO(
		OffsetDateTime atualizadoEm,
		ResumoDTO resumo,
		ProximaAtividadeDTO proximaAtividade,
		List<AlertaDTO> alertas,
		DesempenhoDTO desempenho
) {
	public record ResumoDTO(long fila, long tarefasAtrasadas, long promessasHoje,
			long slasCriticos, BigDecimal valorCarteira) {}
	public record ProximaAtividadeDTO(String tipo, String referencia, String titulo,
			String prioridade, OffsetDateTime prazoEm) {}
	public record AlertaDTO(String tipo, String referencia, String mensagem, String severidade) {}
	public record DesempenhoDTO(long atendimentosHoje, long contatosEfetivos, long negociacoes) {}
}
