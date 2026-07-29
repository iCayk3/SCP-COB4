package br.com.w4solution.cob4.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;

@Getter
@Setter
@Entity
@Table(name = "falhas_sincronizacao_rbx")
public class FalhaSincronizacaoRbx {
	public enum Status { PENDENTE, PROCESSANDO, RESOLVIDA, ESGOTADA }

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@Version
	private long versao;
	@Column(nullable = false, length = 80)
	private String origem;
	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 20)
	private Status status = Status.PENDENTE;
	@Column(nullable = false)
	private int tentativas;
	@Column(name = "max_tentativas", nullable = false)
	private int maxTentativas;
	@Column(name = "criada_em", nullable = false)
	private OffsetDateTime criadaEm;
	@Column(name = "proxima_tentativa_em", nullable = false)
	private OffsetDateTime proximaTentativaEm;
	@Column(name = "ultima_tentativa_em")
	private OffsetDateTime ultimaTentativaEm;
	@Column(name = "resolvida_em")
	private OffsetDateTime resolvidaEm;
	@Column(length = 2000)
	private String mensagem;
}
