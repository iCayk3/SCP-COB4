package br.com.w4solution.cob4.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.OffsetDateTime;

@Getter @Setter
@Entity
@Table(name = "solicitacoes_atualizacao_cliente")
public class SolicitacaoAtualizacaoCliente {
	public enum Status { PENDENTE, APROVADA, REJEITADA }
	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@ManyToOne(optional = false) @JoinColumn(name = "cliente_id", nullable = false)
	private Cliente cliente;
	@Column(name = "novo_telefone", length = 80)
	private String novoTelefone;
	@Column(name = "novo_email", length = 254)
	private String novoEmail;
	@Column(nullable = false, length = 500)
	private String motivo;
	@Enumerated(EnumType.STRING) @Column(nullable = false, length = 20)
	private Status status = Status.PENDENTE;
	@Column(name = "solicitado_por", nullable = false, length = 150)
	private String solicitadoPor;
	@Column(name = "solicitado_em", nullable = false)
	private OffsetDateTime solicitadoEm;
	@Column(name = "decidido_por", length = 150)
	private String decididoPor;
	@Column(name = "decidido_em")
	private OffsetDateTime decididoEm;
}
