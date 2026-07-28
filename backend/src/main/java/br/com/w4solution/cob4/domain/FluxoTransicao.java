package br.com.w4solution.cob4.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "fluxo_transicoes")
public class FluxoTransicao {
	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@ManyToOne(optional = false) @JoinColumn(name = "fluxo_id", nullable = false)
	private FluxoCobranca fluxo;
	@Column(name = "origem_codigo", nullable = false, length = 60)
	private String origemCodigo;
	@Column(name = "destino_codigo", nullable = false, length = 60)
	private String destinoCodigo;
	@Column(nullable = false, length = 150)
	private String nome;
	@Column(nullable = false)
	private boolean automatica;
	@Column(name = "horas_sem_resposta")
	private Integer horasSemResposta;
}
