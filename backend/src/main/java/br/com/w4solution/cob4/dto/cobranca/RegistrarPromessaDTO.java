package br.com.w4solution.cob4.dto.cobranca;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public record RegistrarPromessaDTO(
		@NotNull @DecimalMin("0.01") BigDecimal valor,
		@NotNull @FutureOrPresent LocalDate vencimento,
		@NotBlank String operadorNome,
		@NotBlank String operadorIdentificador,
		String observacao
) {}
