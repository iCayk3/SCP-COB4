package br.com.w4solution.cob4.dto.financeiro;
import java.math.BigDecimal;import java.time.OffsetDateTime;import java.util.List;
public record ConciliacaoFinanceiraDTO(OffsetDateTime executadaEm,int conciliados,int divergentes,int pendentes,
		BigDecimal valorDivergente,List<Item> itens){public record Item(Long pagamentoId,String cobrancaReferencia,
		String status,String motivo,BigDecimal valor,String referenciaExterna){}}
