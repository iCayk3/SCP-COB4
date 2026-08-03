package br.com.w4solution.cob4.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.util.StringUtils;

import java.time.OffsetDateTime;

@Getter
@Setter
@Entity
@Table(name = "fluxos_cobranca")
public class FluxoCobranca {
	public enum StatusVersao { RASCUNHO, PUBLICADO, DESATIVADO }
	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@Column(nullable = false, unique = true, length = 60)
	private String codigo;
	@Column(nullable = false, length = 150)
	private String nome;
	@Column(nullable = false)
	private boolean ativo = true;
	@Column(nullable = false)
	private boolean padrao;
	@Column(nullable=false) private int versao = 1;
	@Enumerated(EnumType.STRING) @Column(name="status_versao",nullable=false,length=20) private StatusVersao statusVersao = StatusVersao.RASCUNHO;
	@Column(name="codigo_origem",nullable=false,length=60) private String codigoOrigem;
	@Column(name="publicado_em") private OffsetDateTime publicadoEm;
	@Version @Column(name="row_version",nullable=false) private long rowVersion;
	@Column(name = "criado_em", nullable = false)
	private OffsetDateTime criadoEm;
	@Column(name = "atualizado_em", nullable = false)
	private OffsetDateTime atualizadoEm;

	@PrePersist @PreUpdate
	void validar() {
		if (!StringUtils.hasText(codigoOrigem)) codigoOrigem = codigo;
		if (!StringUtils.hasText(codigo) || !StringUtils.hasText(nome)) {
			throw new IllegalStateException("Fluxo deve possuir código e nome");
		}
	}
}
