package br.com.w4solution.cob4.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;

@Getter
@Setter
@Entity
@Table(name = "promessas_pagamento")
public class PromessaPagamento {
	public enum Status { ABERTA, CUMPRIDA, QUEBRADA, CANCELADA }

	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@ManyToOne(optional = false) @JoinColumn(name = "cobranca_id", nullable = false)
	private Cobranca cobranca;
	@Column(nullable = false, precision = 19, scale = 2)
	private BigDecimal valor;
	@Column(nullable = false)
	private LocalDate vencimento;
	@Enumerated(EnumType.STRING) @Column(nullable = false, length = 20)
	private Status status = Status.ABERTA;
	@Column(name = "operador_nome", nullable = false, length = 150)
	private String operadorNome;
	@Column(name = "operador_identificador", nullable = false, length = 150)
	private String operadorIdentificador;
	@Column(length = 1000)
	private String observacao;
	@Column(name = "criada_em", nullable = false)
	private OffsetDateTime criadaEm;
	@Column(name = "atualizada_em", nullable = false)
	private OffsetDateTime atualizadaEm;
}
