package br.com.w4solution.cob4.dto.financeiro;

import br.com.w4solution.cob4.domain.PoliticaFinanceira.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

public record PoliticaFinanceiraDTO(
		Long id, Integer versao, Boolean vigente,
		@NotNull TipoJuros jurosTipo,
		@NotNull @DecimalMin("0") BigDecimal jurosPercentual,
		@NotNull PeriodicidadeJuros jurosPeriodicidade,
		@NotNull InicioEncargos jurosInicio,
		@Min(0) int jurosCarenciaDias,
		boolean jurosSobreMulta,
		@DecimalMin("0") BigDecimal jurosLimitePercentual,
		@NotNull TipoMulta multaTipo,
		@NotNull @DecimalMin("0") BigDecimal multaValor,
		@DecimalMin("0") BigDecimal multaLimite,
		@NotNull InicioEncargos multaInicio,
		@Min(0) int multaCarenciaDias,
		boolean multaRecorrente,
		@Min(0) @Max(4) int casasDecimais,
		@NotNull MetodoArredondamento metodoArredondamento,
		@NotNull MomentoArredondamento momentoArredondamento,
		@NotNull DestinoCentavos destinoCentavos,
		@Min(1) int maximoParcelas,
		@NotNull @DecimalMin("0.01") BigDecimal valorMinimoParcela,
		@Min(1) int intervaloParcelasDias,
		@NotNull AjusteDiaNaoUtil ajusteDiaNaoUtil,
		boolean entradaObrigatoria,
		@NotNull @DecimalMin("0") @DecimalMax("100") BigDecimal entradaPercentualMinimo,
		@NotNull @DecimalMin("0") BigDecimal entradaValorMinimo,
		@Min(0) int entradaPrazoDias,
		@Min(0) int primeiraParcelaDias,
		boolean permiteMultiplosContratos,
		boolean bloqueiaContratoJuridico,
		@Min(1) int validadePropostaDias,
		@Min(0) int toleranciaParcelaDias,
		@Min(1) int parcelasVencidasParaQuebra,
		boolean perdeDescontoNaQuebra,
		boolean permiteRenegociacao,
		@Min(0) int maximoRenegociacoes,
		@Valid @NotNull @Size(min = 5, max = 5) List<AlcadaDescontoDTO> alcadas,
		OffsetDateTime publicadaEm, String publicadaPor
) {}
