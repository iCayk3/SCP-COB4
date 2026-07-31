package br.com.w4solution.cob4.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.OffsetDateTime;

@Getter @Setter
@Entity
@Table(name = "atendimento_anexos")
public class AtendimentoAnexo {
	public enum Classificacao { COMPROVANTE, DOCUMENTO, OUTRO }
	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@ManyToOne(optional = false) @JoinColumn(name = "cobranca_id", nullable = false)
	private Cobranca cobranca;
	@Column(name = "nome_original", nullable = false, length = 255)
	private String nomeOriginal;
	@Column(name = "tipo_conteudo", nullable = false, length = 100)
	private String tipoConteudo;
	@Column(nullable = false)
	private long tamanho;
	@Column(name = "sha256", nullable = false, length = 64)
	private String sha256;
	@Basic(fetch = FetchType.LAZY) @Column(nullable = false, columnDefinition = "bytea")
	private byte[] conteudo;
	@Column(name = "enviado_por", nullable = false, length = 150)
	private String enviadoPor;
	@Column(name = "enviado_em", nullable = false)
	private OffsetDateTime enviadoEm;
	@Enumerated(EnumType.STRING) @Column(nullable = false, length = 30,
			columnDefinition = "varchar(30) default 'OUTRO'")
	private Classificacao classificacao = Classificacao.OUTRO;
	@Column(nullable = false, columnDefinition = "boolean default false")
	private boolean criptografado;
}
