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
}
