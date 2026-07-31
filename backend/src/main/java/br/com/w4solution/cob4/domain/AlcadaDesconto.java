package br.com.w4solution.cob4.domain;

import br.com.w4solution.cob4.security.PerfilUsuario;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Table(name = "alcadas_desconto", uniqueConstraints =
		@UniqueConstraint(name = "uk_alcada_politica_perfil", columnNames = {"politica_id", "perfil"}))
public class AlcadaDesconto {
	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@ManyToOne(optional = false, fetch = FetchType.LAZY)
	@JoinColumn(name = "politica_id", nullable = false)
	private PoliticaFinanceira politica;
	@Enumerated(EnumType.STRING) @Column(nullable = false, length = 30)
	private PerfilUsuario perfil;
	@Column(name = "percentual_maximo", nullable = false, precision = 9, scale = 6)
	private BigDecimal percentualMaximo;
	@Column(name = "valor_maximo", precision = 19, scale = 2)
	private BigDecimal valorMaximo;
	@Column(name = "permite_principal", nullable = false)
	private boolean permitePrincipal;
	@Column(name = "permite_juros", nullable = false)
	private boolean permiteJuros;
	@Column(name = "permite_multa", nullable = false)
	private boolean permiteMulta;
	@Column(name = "exige_aprovacao", nullable = false)
	private boolean exigeAprovacao;
}
