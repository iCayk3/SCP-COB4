package br.com.w4solution.cob4.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.util.StringUtils;

import java.time.OffsetDateTime;

@Getter
@Setter
@Entity
@Table(name = "processo_timeline")
public class ProcessoTimeline {
	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@ManyToOne(optional = false) @JoinColumn(name = "cobranca_id", nullable = false)
	private Cobranca cobranca;
	@Column(nullable = false, length = 80)
	private String evento;
	@Column(nullable = false, length = 1000)
	private String descricao;
	@Column(name = "autor_nome", nullable = false, length = 150)
	private String autorNome;
	@Column(name = "autor_identificador", nullable = false, length = 150)
	private String autorIdentificador;
	@Column(name = "criado_em", nullable = false)
	private OffsetDateTime criadoEm;

	@PrePersist
	void validarNovoEvento() {
		if (cobranca == null || !StringUtils.hasText(evento) || !StringUtils.hasText(descricao)
				|| !StringUtils.hasText(autorNome) || !StringUtils.hasText(autorIdentificador)
				|| criadoEm == null) {
			throw new IllegalStateException("RN-030: evento da timeline incompleto");
		}
	}

	@PreUpdate
	void impedirAlteracao() {
		throw new IllegalStateException("RN-030 e RN-032: eventos da timeline não podem ser alterados");
	}

	@PreRemove
	void impedirExclusao() {
		throw new IllegalStateException("RN-031: eventos da timeline não podem ser excluídos");
	}
}
