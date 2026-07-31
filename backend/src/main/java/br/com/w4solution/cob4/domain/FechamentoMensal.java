package br.com.w4solution.cob4.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Getter
@Setter
@Entity
@Table(name = "fechamentos_mensais")
public class FechamentoMensal {
	public enum Status { GERADO, APROVADO, CANCELADO }

	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@Column(nullable = false, length = 7)
	private String competencia;
	@Column(nullable = false)
	private int versao;
	@Enumerated(EnumType.STRING) @Column(nullable = false, length = 20)
	private Status status = Status.GERADO;
	@Column(name = "valor_recuperado", nullable = false, precision = 19, scale = 2)
	private BigDecimal valorRecuperado = BigDecimal.ZERO;
	@Column(name = "protocolos_encerrados", nullable = false)
	private long protocolosEncerrados;
	@Column(name = "promessas_criadas", nullable = false)
	private long promessasCriadas;
	@Column(name = "atendimentos_registrados", nullable = false)
	private long atendimentosRegistrados;
	@Column(name = "gerado_em", nullable = false)
	private OffsetDateTime geradoEm;
	@Column(name = "gerado_por", nullable = false, length = 150)
	private String geradoPor;
	@Column(length = 1000)
	private String observacao;
	@Column(name = "total_pagamentos", nullable = false, precision = 19, scale = 2)
	private BigDecimal totalPagamentos = BigDecimal.ZERO;
	@Column(name = "total_estornos", nullable = false, precision = 19, scale = 2)
	private BigDecimal totalEstornos = BigDecimal.ZERO;
	@Column(name = "total_descontos", nullable = false, precision = 19, scale = 2)
	private BigDecimal totalDescontos = BigDecimal.ZERO;
	@Column(name = "total_juros", nullable = false, precision = 19, scale = 2)
	private BigDecimal totalJuros = BigDecimal.ZERO;
	@Column(name = "total_multas", nullable = false, precision = 19, scale = 2)
	private BigDecimal totalMultas = BigDecimal.ZERO;
	@Column(name = "divergencias_abertas", nullable = false)
	private long divergenciasAbertas;
	@ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "substitui_id")
	private FechamentoMensal substitui;
	@Column(name = "aprovado_em") private OffsetDateTime aprovadoEm;
	@Column(name = "aprovado_por", length = 150) private String aprovadoPor;
	@Column(name = "cancelado_em") private OffsetDateTime canceladoEm;
	@Column(name = "cancelado_por", length = 150) private String canceladoPor;
	@Lob @Column(name = "snapshot_json", nullable = false)
	private String snapshotJson = "{}";
}
