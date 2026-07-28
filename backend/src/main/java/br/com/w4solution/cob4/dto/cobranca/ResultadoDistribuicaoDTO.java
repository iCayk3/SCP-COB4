package br.com.w4solution.cob4.dto.cobranca;

import java.util.List;

public record ResultadoDistribuicaoDTO(int distribuidos, List<ItemDTO> itens) {
	public record ItemDTO(String referencia, String operadorNome, String operadorIdentificador) {}
}
