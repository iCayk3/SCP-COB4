package br.com.w4solution.cob4.dto.cobranca;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public record RegistrarPagamentoDTO(
		@NotNull @DecimalMin("0.01") BigDecimal valor,
		@NotNull LocalDate dataPagamento,
		String boletoReferencia,
		String comprovanteReferencia,
		String observacao
) {}
