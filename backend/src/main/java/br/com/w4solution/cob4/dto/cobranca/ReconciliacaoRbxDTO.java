package br.com.w4solution.cob4.dto.cobranca;

import java.util.List;

public record ReconciliacaoRbxDTO(
		int documentosRbx,
		int boletosAtivosSgcAntes,
		int totalDivergencias,
		List<String> ausentesNoSgc,
		List<String> ausentesNoRbx,
		List<String> valoresDivergentes,
		SincronizacaoCobrancaDTO sincronizacao
) {}
