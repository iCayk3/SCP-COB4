package br.com.w4solution.cob4.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.OffsetDateTime;

@Getter @Setter
@Entity
@Table(name = "agendamentos_atendimento")
public class AgendamentoAtendimento {
	public enum Status { AGENDADO, CONCLUIDO, CANCELADO }
	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@ManyToOne(optional = false) @JoinColumn(name = "cobranca_id", nullable = false)
	private Cobranca cobranca;
	@Column(nullable = false, length = 160)
	private String titulo;
	@Column(length = 1000)
	private String observacao;
	@Column(name = "inicio_em", nullable = false)
	private OffsetDateTime inicioEm;
	@Column(name = "fim_em", nullable = false)
	private OffsetDateTime fimEm;
	@Enumerated(EnumType.STRING) @Column(nullable = false, length = 20)
	private Status status = Status.AGENDADO;
	@Column(name = "responsavel", nullable = false, length = 150)
	private String responsavel;
	@Column(name = "criado_em", nullable = false)
	private OffsetDateTime criadoEm;
}
