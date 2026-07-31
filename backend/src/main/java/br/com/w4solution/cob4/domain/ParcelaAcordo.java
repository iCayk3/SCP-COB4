package br.com.w4solution.cob4.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter @Setter @Entity
@Table(name = "parcelas_acordo", uniqueConstraints = @UniqueConstraint(name = "uk_parcela_acordo_numero", columnNames = {"acordo_id", "numero"}))
public class ParcelaAcordo {
	public enum Status { PENDENTE, PARCIAL, PAGA, VENCIDA, CANCELADA }
	@Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
	@ManyToOne(optional = false, fetch = FetchType.LAZY) @JoinColumn(name = "acordo_id", nullable = false) private AcordoFinanceiro acordo;
	@Column(nullable = false) private int numero;
	@Column(nullable = false) private LocalDate vencimento;
	@Column(nullable = false, precision = 19, scale = 2) private BigDecimal principal;
	@Column(nullable = false, precision = 19, scale = 2) private BigDecimal juros;
	@Column(nullable = false, precision = 19, scale = 2) private BigDecimal multa;
	@Column(nullable = false, precision = 19, scale = 2) private BigDecimal total;
	@Column(name = "valor_pago", nullable = false, precision = 19, scale = 2) private BigDecimal valorPago = BigDecimal.ZERO;
	@Enumerated(EnumType.STRING) @Column(nullable = false, length = 20) private Status status = Status.PENDENTE;
}
