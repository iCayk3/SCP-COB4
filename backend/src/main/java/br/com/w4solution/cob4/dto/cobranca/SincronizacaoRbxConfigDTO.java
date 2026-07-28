package br.com.w4solution.cob4.dto.cobranca;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalTime;

public record SincronizacaoRbxConfigDTO(
		@NotNull LocalTime horarioPrimeira,
		@NotNull LocalTime horarioSegunda,
		@NotBlank String fusoHorario,
		boolean ativo
) {}
