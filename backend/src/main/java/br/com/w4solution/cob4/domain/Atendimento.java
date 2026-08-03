package br.com.w4solution.cob4.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.util.StringUtils;

import java.time.OffsetDateTime;

@Getter
@Setter
@Entity
@Table(name = "atendimentos")
public class Atendimento {
	public enum Canal { CHAT, WHATSAPP, TELEFONE, SMS, EMAIL, PRESENCIAL }
	public enum Resultado { SEM_CONTATO, ATENDEU, NEGOCIACAO, PROMESSA, PAGAMENTO, VISITA, SUPERVISOR, ENCERRAMENTO }

	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@ManyToOne(optional = false) @JoinColumn(name = "cobranca_id", nullable = false)
	private Cobranca cobranca;
	@Enumerated(EnumType.STRING) @Column(nullable = false, length = 30)
	private Canal canal = Canal.CHAT;
	@Enumerated(EnumType.STRING) @Column(nullable = false, length = 30)
	private Resultado resultado;
	@Column(nullable = false, length = 4000)
	private String observacao;
	@Column(name = "proxima_acao", nullable = false, length = 1000)
	private String proximaAcao;
	@Column(name = "operador_nome", nullable = false, length = 150)
	private String operadorNome;
	@Column(name = "operador_identificador", nullable = false, length = 150)
	private String operadorIdentificador;
	@Column(name = "realizado_em", nullable = false)
	private OffsetDateTime realizadoEm;
	@Column(name = "duracao_segundos") private Integer duracaoSegundos;
	@Column(name = "retorno_agendado_em") private OffsetDateTime retornoAgendadoEm;
	@Column(name = "promessa_id") private Long promessaId;
	@Column(name = "acordo_id") private Long acordoId;
	@Column(name = "agendamento_id") private Long agendamentoId;

	@PrePersist
	void validar() {
		if (canal == null || resultado == null || !StringUtils.hasText(observacao)
				|| !StringUtils.hasText(proximaAcao) || !StringUtils.hasText(operadorNome)
				|| !StringUtils.hasText(operadorIdentificador) || realizadoEm == null) {
			throw new IllegalStateException("RN-021 a RN-024: atendimento incompleto");
		}
	}

	@PreUpdate
	void impedirAlteracao() {
		throw new IllegalStateException("RN-020: o histórico de atendimento é imutável");
	}
}
