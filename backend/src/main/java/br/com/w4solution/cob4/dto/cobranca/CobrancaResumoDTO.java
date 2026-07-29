package br.com.w4solution.cob4.dto.cobranca;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

public record CobrancaResumoDTO(
		String referencia,
		String cpf,
		String cliente,
		String telefone,
		String email,
		BigDecimal valorTotal,
		long quantidadeBoletos,
		OffsetDateTime atualizadaEm,
		String status,
		String contratoReferencia,
		String clienteRbxCodigo,
		String prioridade,
		int slaHoras,
		String responsavelNome,
		String estadoFluxo,
		OffsetDateTime estadoFluxoDesde,
		int diasAtraso,
		String faixaAtraso,
		OffsetDateTime slaPausadoEm,
		int slaEscalonamentoNivel,
		OffsetDateTime slaAlertadoEm,
		OffsetDateTime slaUltimaNotificacaoEm
) {
}
