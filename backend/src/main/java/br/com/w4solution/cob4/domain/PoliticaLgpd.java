package br.com.w4solution.cob4.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.OffsetDateTime;

@Getter
@Setter
@Entity
@Table(name = "politicas_lgpd", uniqueConstraints =
		@UniqueConstraint(name = "uk_politica_lgpd_codigo", columnNames = "codigo"))
public class PoliticaLgpd {
	public enum DestinoFinal { ELIMINAR, ANONIMIZAR, CONSERVAR_BLOQUEADO }
	public enum StatusAprovacao { PENDENTE_APROVACAO, APROVADA, REJEITADA }

	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@Column(nullable = false, length = 50)
	private String codigo;
	@Column(nullable = false, length = 120)
	private String categoria;
	@Column(nullable = false, length = 1000)
	private String dadosPessoais;
	@Column(nullable = false, length = 1000)
	private String finalidade;
	@Column(nullable = false, length = 500)
	private String baseLegal;
	@Column(nullable = false, length = 500)
	private String origem;
	@Column(nullable = false, length = 500)
	private String perfisAcesso;
	@Column(name = "retencao_meses")
	private Integer retencaoMeses;
	@Enumerated(EnumType.STRING) @Column(name = "destino_final", nullable = false, length = 30)
	private DestinoFinal destinoFinal;
	@Enumerated(EnumType.STRING) @Column(name = "status_aprovacao", nullable = false, length = 30)
	private StatusAprovacao statusAprovacao = StatusAprovacao.PENDENTE_APROVACAO;
	@Column(name = "observacao_aprovacao", length = 1000)
	private String observacaoAprovacao;
	@Column(name = "aprovada_por", length = 150)
	private String aprovadaPor;
	@Column(name = "aprovada_em")
	private OffsetDateTime aprovadaEm;
}
