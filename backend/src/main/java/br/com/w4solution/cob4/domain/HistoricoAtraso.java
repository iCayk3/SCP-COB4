package br.com.w4solution.cob4.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;

@Getter
@Setter
@Entity
@Table(name = "historico_atrasos")
public class HistoricoAtraso {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, length = 14)
	private String cpf;
	@Column(name = "cliente_nome", nullable = false)
	private String clienteNome;
	@Column(name = "boleto_referencia", nullable = false, unique = true, length = 120)
	private String boletoReferencia;
	@Column(name = "contrato_referencia", length = 120)
	private String contratoReferencia;
	@Column(nullable = false, precision = 19, scale = 2)
	private BigDecimal valor;
	@Column(nullable = false)
	private LocalDate vencimento;
	@Column(name = "data_pagamento")
	private LocalDate dataPagamento;
	@Column(name = "dias_atraso", nullable = false)
	private long diasAtraso;
	@Column(nullable = false, length = 20)
	private String situacao;
	@Column(name = "primeira_deteccao_em", nullable = false)
	private OffsetDateTime primeiraDeteccaoEm;
	@Column(name = "ultima_deteccao_em", nullable = false)
	private OffsetDateTime ultimaDeteccaoEm;
}
