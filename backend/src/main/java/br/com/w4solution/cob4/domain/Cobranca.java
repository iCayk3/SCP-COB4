package br.com.w4solution.cob4.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PostLoad;
import jakarta.persistence.PostUpdate;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Transient;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import org.springframework.util.StringUtils;

@Getter
@Setter
@Entity
@Table(name = "cobrancas")
public class Cobranca {
	public enum Status { ABERTA, EM_ANDAMENTO, ENCERRADA, PAGA, CANCELADA }
	public enum Prioridade { BAIXA, MEDIA, ALTA, CRITICA }
	public enum FaixaAtraso {
		F1_RECENTE, F2_INICIAL, F3_INTERMEDIARIO, F4_AVANCADO, F5_CRITICO, F6_JURIDICO
	}

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "referencia", nullable = false, unique = true, length = 50)
	private String referencia;

	@ManyToOne(optional = false)
	@JoinColumn(name = "cliente_id", nullable = false)
	private Cliente cliente;

	@Column(name = "cpf_agregador", nullable = false, length = 14)
	private String cpfAgregador;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 20)
	private Status status = Status.ABERTA;

	@Column(name = "fluxo_codigo", nullable = false, length = 60,
			columnDefinition = "varchar(60) default 'COBRANCA_PADRAO'")
	private String fluxoCodigo = "COBRANCA_PADRAO";

	@Column(name = "estado_fluxo", nullable = false, length = 60,
			columnDefinition = "varchar(60) default 'NOVO'")
	private String estadoFluxo = "NOVO";

	@Column(name = "estado_fluxo_desde", nullable = false,
			columnDefinition = "timestamp with time zone default current_timestamp")
	private OffsetDateTime estadoFluxoDesde;

	@Column(name = "valor_total", nullable = false, precision = 19, scale = 2)
	private BigDecimal valorTotal = BigDecimal.ZERO;

	@Column(name = "dias_atraso", nullable = false, columnDefinition = "integer default 0")
	private int diasAtraso;

	@Enumerated(EnumType.STRING)
	@Column(name = "faixa_atraso", nullable = false, length = 30,
			columnDefinition = "varchar(30) default 'F1_RECENTE'")
	private FaixaAtraso faixaAtraso = FaixaAtraso.F1_RECENTE;

	@Column(name = "contrato_referencia", nullable = false, length = 500,
			columnDefinition = "varchar(500) default 'NAO_INFORMADO'")
	private String contratoReferencia = "NAO_INFORMADO";

	@Column(name = "operador_nome", nullable = false, length = 150,
			columnDefinition = "varchar(150) default 'Integracao RBX'")
	private String operadorNome = "Integração RBX";

	@Column(name = "operador_identificador", nullable = false, length = 150,
			columnDefinition = "varchar(150) default 'RBX'")
	private String operadorIdentificador = "RBX";

	@Column(name = "responsavel_nome", nullable = false, length = 150,
			columnDefinition = "varchar(150) default 'Fila de Cobranca'")
	private String responsavelNome = "Fila de Cobrança";

	@Column(name = "responsavel_identificador", nullable = false, length = 150,
			columnDefinition = "varchar(150) default 'FILA_COBRANCA'")
	private String responsavelIdentificador = "FILA_COBRANCA";

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 20, columnDefinition = "varchar(20) default 'MEDIA'")
	private Prioridade prioridade = Prioridade.MEDIA;

	@Column(name = "sla_horas", nullable = false, columnDefinition = "integer default 24")
	private int slaHoras = 24;

	@Column(name = "ultima_movimentacao_em", nullable = false,
			columnDefinition = "timestamp with time zone default current_timestamp")
	private OffsetDateTime ultimaMovimentacaoEm;

	@Column(name = "sla_alertado_em")
	private OffsetDateTime slaAlertadoEm;

	@Column(name = "sla_pausado_em")
	private OffsetDateTime slaPausadoEm;

	@Column(name = "sla_pausa_segundos", nullable = false, columnDefinition = "bigint default 0")
	private long slaPausaSegundos;

	@Column(name = "sla_escalonamento_nivel", nullable = false, columnDefinition = "integer default 0")
	private int slaEscalonamentoNivel;

	@Column(name = "sla_ultima_notificacao_em")
	private OffsetDateTime slaUltimaNotificacaoEm;

	@Column(name = "encerrada_em")
	private OffsetDateTime encerradaEm;

	@Column(name = "motivo_encerramento", length = 500)
	private String motivoEncerramento;

	@Column(name = "motivo_encerramento_codigo", length = 60)
	private String motivoEncerramentoCodigo;

	@Column(name = "motivo_encerramento_nome", length = 120)
	private String motivoEncerramentoNome;

	@Column(name = "observacao_encerramento", length = 1000)
	private String observacaoEncerramento;

	@Column(name = "motivo_reabertura_codigo", length = 60)
	private String motivoReaberturaCodigo;

	@Column(name = "motivo_reabertura_nome", length = 120)
	private String motivoReaberturaNome;

	@Column(name = "observacao_reabertura", length = 1000)
	private String observacaoReabertura;

	@Column(name = "criada_em", nullable = false)
	private OffsetDateTime criadaEm;

	@Column(name = "atualizada_em", nullable = false)
	private OffsetDateTime atualizadaEm;

	@Transient
	private Status statusCarregado;

	@Transient
	private boolean reaberturaAutorizada;

	public void autorizarReabertura() { this.reaberturaAutorizada = true; }

	public boolean encerrada() {
		return status == Status.ENCERRADA || status == Status.PAGA || status == Status.CANCELADA;
	}

	@PostLoad
	@PostUpdate
	void registrarEstadoCarregado() {
		statusCarregado = status;
	}

	@PrePersist
	@PreUpdate
	void validarRegras() {
		if (estadoFluxoDesde == null) {
			estadoFluxoDesde = criadaEm != null ? criadaEm : OffsetDateTime.now();
		}
		if (!StringUtils.hasText(responsavelNome) || !StringUtils.hasText(responsavelIdentificador)) {
			throw new IllegalStateException("RN-004: o processo não pode ficar sem responsável");
		}
		if (!StringUtils.hasText(fluxoCodigo) || !StringUtils.hasText(estadoFluxo)) {
			throw new IllegalStateException("O cliente nunca poderá ficar sem fluxo e estado definidos");
		}
		if (!reaberturaAutorizada && statusCarregado != null && (statusCarregado == Status.ENCERRADA
				|| statusCarregado == Status.PAGA || statusCarregado == Status.CANCELADA)) {
			throw new IllegalStateException("RN-006: processos encerrados não podem ser editados");
		}
		if (encerrada() && !StringUtils.hasText(motivoEncerramento)) {
			throw new IllegalStateException("RN-007: todo processo encerrado deve informar o motivo");
		}
		if (slaHoras <= 0) {
			throw new IllegalStateException("RN-005: o SLA deve ser maior que zero");
		}
	}
}
