package br.com.w4solution.cob4.dto.financeiro;
import br.com.w4solution.cob4.domain.PagamentoFinanceiro;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;
public record RegistrarPagamentoFinanceiroDTO(@NotBlank String cobrancaReferencia,String acordoProtocolo,
		@NotNull @DecimalMin("0.01") BigDecimal valor,@NotNull LocalDate dataPagamento,@NotNull Long comprovanteId,
		@NotNull PagamentoFinanceiro.Origem origem,String referenciaExterna,@NotBlank String chaveIdempotencia,
		@Size(max=1000) String observacao){}
