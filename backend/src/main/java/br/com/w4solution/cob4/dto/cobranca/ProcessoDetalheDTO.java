package br.com.w4solution.cob4.dto.cobranca;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;

public record ProcessoDetalheDTO(
		String referencia,
		ClienteDTO cliente,
		String contratoReferencia,
		String status,
		String prioridade,
		BigDecimal valorTotal,
		int diasAtraso,
		String faixaAtraso,
		ResponsavelDTO responsavel,
		SlaDTO sla,
		FluxoDTO fluxo,
		List<BoletoDTO> boletos,
		ResumoRelacionadosDTO relacionados,
		List<String> acoesPermitidas,
		OffsetDateTime criadaEm,
		OffsetDateTime atualizadaEm,
		OffsetDateTime encerradaEm
) {
	public record ClienteDTO(String cpf, String nome, String telefone, String email, String rbxCodigo) {}
	public record ResponsavelDTO(String identificador, String nome) {}
	public record SlaDTO(int horas, OffsetDateTime estadoDesde, OffsetDateTime pausadoEm,
			int nivelEscalonamento, OffsetDateTime alertadoEm) {}
	public record FluxoDTO(String codigo, String estado, List<DestinoDTO> destinos) {}
	public record DestinoDTO(String codigo, String nome, String transicao) {}
	public record BoletoDTO(String documento, BigDecimal valor, LocalDate vencimento, boolean ativo) {}
	public record ResumoRelacionadosDTO(long atendimentos, long eventosTimeline, long tarefasPendentes,
			long promessasAbertas) {}
}
