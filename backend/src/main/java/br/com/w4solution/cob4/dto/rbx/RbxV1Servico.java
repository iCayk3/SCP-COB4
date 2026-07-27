package br.com.w4solution.cob4.dto.rbx;

public record RbxV1Servico(
		String grupo,
		String servico,
		String nome,
		boolean aceitaFiltro,
		String payloadPrincipal,
		String observacao
) {
}
