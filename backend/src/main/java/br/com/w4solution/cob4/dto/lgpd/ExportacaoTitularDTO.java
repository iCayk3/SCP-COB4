package br.com.w4solution.cob4.dto.lgpd;

import java.util.List;

public record ExportacaoTitularDTO(
		String cpf, String nome, String telefone, String email,
		List<ProtocoloDTO> protocolos
) {
	public record ProtocoloDTO(String referencia, String contrato, String status, String estado, String valor) {}
}
