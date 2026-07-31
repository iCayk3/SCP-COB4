package br.com.w4solution.cob4.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "politicas_financeiras", uniqueConstraints =
		@UniqueConstraint(name = "uk_politica_financeira_versao", columnNames = "versao"))
public class PoliticaFinanceira {
	public enum TipoJuros { SIMPLES, COMPOSTO }
	public enum PeriodicidadeJuros { DIARIA, MENSAL, ANUAL }
	public enum InicioEncargos { NO_VENCIMENTO, DIA_SEGUINTE, APOS_CARENCIA }
	public enum TipoMulta { PERCENTUAL, VALOR_FIXO }
	public enum MetodoArredondamento { MEIO_PARA_CIMA, MEIO_PARA_BAIXO, MEIO_PAR, TRUNCAR, PARA_CIMA, PARA_BAIXO }
	public enum MomentoArredondamento { POR_COMPONENTE, POR_PARCELA, TOTAL_FINAL }
	public enum DestinoCentavos { PRIMEIRA_PARCELA, ULTIMA_PARCELA, DISTRIBUIR }
	public enum AjusteDiaNaoUtil { PROXIMO_DIA_UTIL, DIA_UTIL_ANTERIOR, MANTER }

	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@Column(nullable = false)
	private int versao;
	@Column(nullable = false)
	private boolean vigente;
	@Enumerated(EnumType.STRING) @Column(name = "juros_tipo", nullable = false, length = 20)
	private TipoJuros jurosTipo;
	@Column(name = "juros_percentual", nullable = false, precision = 9, scale = 6)
	private BigDecimal jurosPercentual;
	@Enumerated(EnumType.STRING) @Column(name = "juros_periodicidade", nullable = false, length = 20)
	private PeriodicidadeJuros jurosPeriodicidade;
	@Enumerated(EnumType.STRING) @Column(name = "juros_inicio", nullable = false, length = 30)
	private InicioEncargos jurosInicio;
	@Column(name = "juros_carencia_dias", nullable = false)
	private int jurosCarenciaDias;
	@Column(name = "juros_sobre_multa", nullable = false)
	private boolean jurosSobreMulta;
	@Column(name = "juros_limite_percentual", precision = 9, scale = 6)
	private BigDecimal jurosLimitePercentual;
	@Enumerated(EnumType.STRING) @Column(name = "multa_tipo", nullable = false, length = 20)
	private TipoMulta multaTipo;
	@Column(name = "multa_valor", nullable = false, precision = 19, scale = 6)
	private BigDecimal multaValor;
	@Column(name = "multa_limite", precision = 19, scale = 2)
	private BigDecimal multaLimite;
	@Enumerated(EnumType.STRING) @Column(name = "multa_inicio", nullable = false, length = 30)
	private InicioEncargos multaInicio;
	@Column(name = "multa_carencia_dias", nullable = false)
	private int multaCarenciaDias;
	@Column(name = "multa_recorrente", nullable = false)
	private boolean multaRecorrente;
	@Column(name = "casas_decimais", nullable = false)
	private int casasDecimais;
	@Enumerated(EnumType.STRING) @Column(name = "metodo_arredondamento", nullable = false, length = 30)
	private MetodoArredondamento metodoArredondamento;
	@Enumerated(EnumType.STRING) @Column(name = "momento_arredondamento", nullable = false, length = 30)
	private MomentoArredondamento momentoArredondamento;
	@Enumerated(EnumType.STRING) @Column(name = "destino_centavos", nullable = false, length = 30)
	private DestinoCentavos destinoCentavos;
	@Column(name = "maximo_parcelas", nullable = false)
	private int maximoParcelas;
	@Column(name = "valor_minimo_parcela", nullable = false, precision = 19, scale = 2)
	private BigDecimal valorMinimoParcela;
	@Column(name = "intervalo_parcelas_dias", nullable = false)
	private int intervaloParcelasDias;
	@Enumerated(EnumType.STRING) @Column(name = "ajuste_dia_nao_util", nullable = false, length = 30)
	private AjusteDiaNaoUtil ajusteDiaNaoUtil;
	@Column(name = "entrada_obrigatoria", nullable = false)
	private boolean entradaObrigatoria;
	@Column(name = "entrada_percentual_minimo", nullable = false, precision = 9, scale = 6)
	private BigDecimal entradaPercentualMinimo;
	@Column(name = "entrada_valor_minimo", nullable = false, precision = 19, scale = 2)
	private BigDecimal entradaValorMinimo;
	@Column(name = "entrada_prazo_dias", nullable = false)
	private int entradaPrazoDias;
	@Column(name = "primeira_parcela_dias", nullable = false)
	private int primeiraParcelaDias;
	@Column(name = "permite_multiplos_contratos", nullable = false)
	private boolean permiteMultiplosContratos;
	@Column(name = "bloqueia_contrato_juridico", nullable = false)
	private boolean bloqueiaContratoJuridico;
	@Column(name = "validade_proposta_dias", nullable = false)
	private int validadePropostaDias;
	@Column(name = "tolerancia_parcela_dias", nullable = false)
	private int toleranciaParcelaDias;
	@Column(name = "parcelas_vencidas_para_quebra", nullable = false)
	private int parcelasVencidasParaQuebra;
	@Column(name = "perde_desconto_na_quebra", nullable = false)
	private boolean perdeDescontoNaQuebra;
	@Column(name = "permite_renegociacao", nullable = false)
	private boolean permiteRenegociacao;
	@Column(name = "maximo_renegociacoes", nullable = false)
	private int maximoRenegociacoes;
	@Column(name = "publicada_em", nullable = false)
	private OffsetDateTime publicadaEm;
	@Column(name = "publicada_por", nullable = false, length = 150)
	private String publicadaPor;

	@OneToMany(mappedBy = "politica", cascade = CascadeType.ALL, orphanRemoval = true)
	@OrderBy("perfil asc")
	private List<AlcadaDesconto> alcadas = new ArrayList<>();
}
