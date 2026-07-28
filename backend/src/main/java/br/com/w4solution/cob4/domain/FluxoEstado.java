package br.com.w4solution.cob4.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "fluxo_estados", uniqueConstraints = @UniqueConstraint(columnNames = {"fluxo_id", "codigo"}))
public class FluxoEstado {
	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@ManyToOne(optional = false) @JoinColumn(name = "fluxo_id", nullable = false)
	private FluxoCobranca fluxo;
	@Column(nullable = false, length = 60)
	private String codigo;
	@Column(nullable = false, length = 120)
	private String nome;
	@Column(name = "ordem_exibicao", nullable = false)
	private int ordem;
	@Column(nullable = false)
	private boolean inicial;
	@Column(nullable = false)
	private boolean terminal;
}
