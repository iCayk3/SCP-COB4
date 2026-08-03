package br.com.w4solution.cob4.dto.fluxo;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record FluxoDTO(
		Long id,
		String codigo,
		@NotBlank String nome,
		boolean ativo,
		boolean padrao,
		@NotEmpty List<@Valid EstadoDTO> estados,
		@NotEmpty List<@Valid TransicaoDTO> transicoes,
		Integer versao, String statusVersao, String codigoOrigem, Long rowVersion
) {
	public record EstadoDTO(@NotBlank String codigo, @NotBlank String nome, int ordem,
							boolean inicial, boolean terminal) {}
	public record TransicaoDTO(@NotBlank String origemCodigo, @NotBlank String destinoCodigo,
							   @NotBlank String nome, boolean automatica, Integer horasSemResposta) {}
}
