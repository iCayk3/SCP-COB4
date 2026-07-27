package br.com.w4solution.cob4.dto.rbx;

import br.com.w4solution.cob4.dto.cliente.ClienteRbxDTO;

public record ClientesInadimplentesDTO(
		ClienteRbxDTO cliente,
		double valor,
		ClientesInadiplentesRbxDTO bloqueio,
		String vencimento,
		Long diasAtrasado
) {

	public ClientesInadimplentesDTO(ClienteRbxDTO cliente, double valor, String vencimento, Long diasAtrasado) {
		this(cliente, valor, null, vencimento, diasAtrasado);
	}
}
