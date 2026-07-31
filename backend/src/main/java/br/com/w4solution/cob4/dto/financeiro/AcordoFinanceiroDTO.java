package br.com.w4solution.cob4.dto.financeiro;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;
public record AcordoFinanceiroDTO(Long id, String protocolo, String status, int politicaVersao,
		BigDecimal principal, BigDecimal juros, BigDecimal multa, BigDecimal desconto,
		BigDecimal entrada, BigDecimal valorNegociado, int quantidadeParcelas,
		OffsetDateTime criadoEm, OffsetDateTime validoAte, String criadoPor, String decididoPor,
		String justificativa, String motivoDecisao, boolean exigeAprovacao,
		List<Item> itens, List<Parcela> parcelas) {
	public record Item(String cobrancaReferencia, BigDecimal principal, BigDecimal juros,
			BigDecimal multa, BigDecimal desconto, BigDecimal total) {}
	public record Parcela(Long id, int numero, LocalDate vencimento, BigDecimal principal,
			BigDecimal juros, BigDecimal multa, BigDecimal total, BigDecimal valorPago, String status) {}
}
