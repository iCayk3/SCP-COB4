package br.com.w4solution.cob4.dto.rbx;

public record RbxV2Servico(
		String moduloSistema,
		String funcaoSistema,
		String acaoSistema,
		String fonteDados,
		String servicoProvider,
		String payloadRaiz,
		String observacao
) {
}
