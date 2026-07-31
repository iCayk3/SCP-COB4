package br.com.w4solution.cob4.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter @Setter @Entity @Table(name = "acordo_itens")
public class AcordoItem {
	@Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
	@ManyToOne(optional = false, fetch = FetchType.LAZY) @JoinColumn(name = "acordo_id", nullable = false) private AcordoFinanceiro acordo;
	@ManyToOne(optional = false, fetch = FetchType.LAZY) @JoinColumn(name = "cobranca_id", nullable = false) private Cobranca cobranca;
	@Column(nullable = false, precision = 19, scale = 2) private BigDecimal principal;
	@Column(nullable = false, precision = 19, scale = 2) private BigDecimal juros;
	@Column(nullable = false, precision = 19, scale = 2) private BigDecimal multa;
	@Column(nullable = false, precision = 19, scale = 2) private BigDecimal desconto;
	@Column(nullable = false, precision = 19, scale = 2) private BigDecimal total;
}
