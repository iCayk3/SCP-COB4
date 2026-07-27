package br.com.w4solution.cob4.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;

@Getter
@Setter
@Entity
@Table(name = "cobranca_boletos", uniqueConstraints = @UniqueConstraint(
		name = "uk_boleto_rbx", columnNames = {"rbx_documento"}))
public class CobrancaBoleto {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(optional = false)
	@JoinColumn(name = "cobranca_id", nullable = false)
	private Cobranca cobranca;

	@Column(name = "rbx_documento", nullable = false, length = 120)
	private String rbxDocumento;

	@Column(name = "contrato_referencia", length = 120)
	private String contratoReferencia;

	@Column(nullable = false, precision = 19, scale = 2)
	private BigDecimal valor;

	@Column(nullable = false)
	private LocalDate vencimento;

	@Column(name = "primeira_deteccao_em", nullable = false)
	private OffsetDateTime primeiraDeteccaoEm;

	@Column(name = "ultima_deteccao_em", nullable = false)
	private OffsetDateTime ultimaDeteccaoEm;

	@Column(nullable = false, columnDefinition = "boolean default true")
	private boolean ativo = true;
}
