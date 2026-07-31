package br.com.w4solution.cob4.dto.financeiro;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
public record CriarAcordoDTO(
		@NotEmpty List<@NotBlank String> cobrancas,
		@NotNull @DecimalMin("0") @DecimalMax("100") BigDecimal descontoPercentual,
		@NotNull @DecimalMin("0") BigDecimal entrada,
		@Min(1) int parcelas,
		@NotNull LocalDate primeiroVencimento,
		@NotBlank @Size(max = 1000) String justificativa
) {}
