package br.com.w4solution.cob4.dto.cobranca;

import java.math.BigDecimal;
import java.util.List;

public record ClienteVisao360DTO(
		String cpf,
		String nome,
		String telefone,
		String email,
		String rbxCodigo,
		BigDecimal valorTotalAtivo,
		List<ProcessoDetalheDTO> processos
) {}
