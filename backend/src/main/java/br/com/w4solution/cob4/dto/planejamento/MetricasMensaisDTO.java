package br.com.w4solution.cob4.dto.planejamento;

import java.math.BigDecimal;
import java.time.YearMonth;
import java.util.List;

public record MetricasMensaisDTO(
		YearMonth competencia,
		List<IndicadorDTO> indicadores,
		List<ProdutividadeDTO> produtividade
) {
	public record IndicadorDTO(
			String codigo, String nome, String unidade, BigDecimal valor,
			Long numerador, Long denominador, String meta, String disponibilidade, String observacao
	) {}
	public record ProdutividadeDTO(String operador, long atendimentos) {}
}
