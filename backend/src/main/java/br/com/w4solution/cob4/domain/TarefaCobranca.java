package br.com.w4solution.cob4.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;

@Getter
@Setter
@Entity
@Table(name = "tarefas_cobranca")
public class TarefaCobranca {
	public enum Status { PENDENTE, EM_ANDAMENTO, CONCLUIDA, CANCELADA }

	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@ManyToOne(optional = false) @JoinColumn(name = "cobranca_id", nullable = false)
	private Cobranca cobranca;
	@Column(nullable = false, length = 80)
	private String tipo;
	@Column(nullable = false, length = 250)
	private String titulo;
	@Enumerated(EnumType.STRING) @Column(nullable = false, length = 20)
	private Status status = Status.PENDENTE;
	@Enumerated(EnumType.STRING) @Column(nullable = false, length = 20)
	private Cobranca.Prioridade prioridade;
	@Column(name = "responsavel_nome", nullable = false, length = 150)
	private String responsavelNome;
	@Column(name = "responsavel_identificador", nullable = false, length = 150)
	private String responsavelIdentificador;
	@Column(name = "prazo_em", nullable = false)
	private OffsetDateTime prazoEm;
	@Column(name = "criada_em", nullable = false)
	private OffsetDateTime criadaEm;
}
