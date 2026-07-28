package br.com.w4solution.cob4.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "motivos_catalogo", uniqueConstraints =
		@UniqueConstraint(name = "uk_motivo_tipo_codigo", columnNames = {"tipo", "codigo"}))
public class MotivoCatalogo {
	public enum Tipo {
		MOVIMENTACAO, ENCERRAMENTO, REABERTURA, VISITA, RETIRADA, JURIDICO, CANCELAMENTO_FECHAMENTO
	}

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 40)
	private Tipo tipo;

	@Column(nullable = false, length = 60)
	private String codigo;

	@Column(nullable = false, length = 120)
	private String nome;

	@Column(length = 500)
	private String descricao;

	@Column(nullable = false)
	private boolean ativo = true;

	@Column(nullable = false)
	private int ordem;

	@Column(name = "exige_observacao", nullable = false)
	private boolean exigeObservacao;
}
