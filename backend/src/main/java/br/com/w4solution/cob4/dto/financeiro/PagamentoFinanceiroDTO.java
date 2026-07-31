package br.com.w4solution.cob4.dto.financeiro;
import java.math.BigDecimal;
import java.time.*;
import java.util.List;
public record PagamentoFinanceiroDTO(Long id,String cobrancaReferencia,String acordoProtocolo,BigDecimal valor,
		BigDecimal creditoExcedente,LocalDate dataPagamento,String status,String origem,String referenciaExterna,
		Long comprovanteId,String chaveIdempotencia,OffsetDateTime registradoEm,String registradoPor,
		OffsetDateTime confirmadoEm,String confirmadoPor,String observacao,List<Alocacao> alocacoes){
	public record Alocacao(Long parcelaId,Integer parcelaNumero,BigDecimal multa,BigDecimal juros,BigDecimal principal,BigDecimal total){}
}
