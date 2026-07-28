package br.com.w4solution.cob4.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "faixas_atraso", uniqueConstraints = {
		@UniqueConstraint(name = "uk_faixa_codigo", columnNames = "codigo"),
		@UniqueConstraint(name = "uk_faixa_ordem", columnNames = "ordem")
})
public class FaixaAtrasoConfig {
	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@Column(nullable = false, length = 30)
	private String codigo;
	@Column(nullable = false, length = 100)
	private String nome;
	@Column(nullable = false)
	private int ordem;
	@Column(name = "dias_inicio", nullable = false)
	private int diasInicio;
	@Column(name = "dias_fim")
	private Integer diasFim;
	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 20)
	private Cobranca.Prioridade prioridade;
}
