package br.com.w4solution.cob4.domain;

import br.com.w4solution.cob4.security.PerfilUsuario;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;

@Getter
@Setter
@Entity
@Table(name = "usuarios")
public class Usuario {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, length = 150)
	private String nome;

	@Column(nullable = false, unique = true, length = 80)
	private String identificador;

	@Column(name = "senha_hash", nullable = false, length = 100)
	private String senhaHash;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 30)
	private PerfilUsuario perfil;

	@Column(nullable = false)
	private boolean ativo = true;

	@Column(nullable = false)
	private boolean presente = true;

	@Column(name = "carga_maxima", nullable = false)
	private int cargaMaxima = 50;

	@Column(name = "troca_senha_obrigatoria", nullable = false, columnDefinition = "boolean default true")
	private boolean trocaSenhaObrigatoria = true;

	@Column(name = "versao_token", nullable = false, columnDefinition = "bigint default 0")
	private long versaoToken = 0;

	@Column(name = "falhas_login", nullable = false, columnDefinition = "integer default 0")
	private int falhasLogin = 0;

	@Column(name = "bloqueado_ate")
	private OffsetDateTime bloqueadoAte;

	@Column(name = "ultimo_login_em")
	private OffsetDateTime ultimoLoginEm;

	@Column(name = "senha_alterada_em")
	private OffsetDateTime senhaAlteradaEm;

	@Column(name = "criado_em", nullable = false)
	private OffsetDateTime criadoEm;

	@Column(name = "atualizado_em", nullable = false)
	private OffsetDateTime atualizadoEm;

	@PrePersist
	void criar() {
		OffsetDateTime agora = OffsetDateTime.now();
		if (criadoEm == null) criadoEm = agora;
		if (atualizadoEm == null) atualizadoEm = agora;
		if (senhaAlteradaEm == null) senhaAlteradaEm = agora;
	}

	@PreUpdate
	void atualizar() {
		atualizadoEm = OffsetDateTime.now();
	}
}
