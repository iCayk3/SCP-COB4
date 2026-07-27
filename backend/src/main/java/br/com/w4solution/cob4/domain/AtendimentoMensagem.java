package br.com.w4solution.cob4.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;

@Getter
@Setter
@Entity
@Table(name = "atendimento_mensagens")
public class AtendimentoMensagem {
	public enum Autor { OPERADOR, CLIENTE, SISTEMA }

	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@ManyToOne(optional = false) @JoinColumn(name = "atendimento_id", nullable = false)
	private Atendimento atendimento;
	@Enumerated(EnumType.STRING) @Column(nullable = false, length = 20)
	private Autor autor;
	@Column(nullable = false, length = 4000)
	private String mensagem;
	@Column(name = "enviada_em", nullable = false)
	private OffsetDateTime enviadaEm;

	@PreUpdate
	void impedirAlteracao() {
		throw new IllegalStateException("RN-020: mensagens do histórico são imutáveis");
	}
}
