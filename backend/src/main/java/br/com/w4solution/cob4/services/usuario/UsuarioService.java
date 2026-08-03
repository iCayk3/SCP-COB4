package br.com.w4solution.cob4.services.usuario;

import br.com.w4solution.cob4.domain.Usuario;
import br.com.w4solution.cob4.dto.usuario.*;
import br.com.w4solution.cob4.dto.api.PaginaDTO;
import br.com.w4solution.cob4.repositories.UsuarioRepository;
import br.com.w4solution.cob4.security.PerfilUsuario;
import br.com.w4solution.cob4.security.UsuarioAtualService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Locale;
import java.util.Set;

@Service
public class UsuarioService {
	private static final Set<String> SENHAS_PROIBIDAS = Set.of(
			"alterar@123", "administrador", "password", "senha123", "123456789012");
	private final UsuarioRepository repository;
	private final PasswordEncoder passwordEncoder;
	private final JwtEncoder jwtEncoder;
	private final UsuarioAtualService usuarioAtual;
	private final AuditoriaSegurancaService auditoria;
	private final long expiracaoSegundos;
	private final int maxFalhas;
	private final long bloqueioMinutos;

	public UsuarioService(UsuarioRepository repository, PasswordEncoder passwordEncoder, JwtEncoder jwtEncoder,
						  UsuarioAtualService usuarioAtual, AuditoriaSegurancaService auditoria,
						  @Value("${sgc.security.jwt.expiracao-segundos:1800}") long expiracaoSegundos,
						  @Value("${sgc.security.login.max-falhas:5}") int maxFalhas,
						  @Value("${sgc.security.login.bloqueio-minutos:15}") long bloqueioMinutos) {
		this.repository = repository;
		this.passwordEncoder = passwordEncoder;
		this.jwtEncoder = jwtEncoder;
		this.usuarioAtual = usuarioAtual;
		this.auditoria = auditoria;
		this.expiracaoSegundos = expiracaoSegundos;
		this.maxFalhas = maxFalhas;
		this.bloqueioMinutos = bloqueioMinutos;
	}

	@Transactional
	public TokenDTO autenticar(LoginDTO dados) {
		String identificador = dados.identificador().trim().toLowerCase(Locale.ROOT);
		Usuario usuario = repository.findByIdentificadorIgnoreCase(identificador).orElse(null);
		if (usuario == null || !usuario.isAtivo()) {
			auditoria.registrar("LOGIN_FALHOU", null, identificador, "Credenciais invalidas");
			throw new BadCredentialsException("Credenciais invalidas");
		}
		OffsetDateTime agora = OffsetDateTime.now();
		if (usuario.getBloqueadoAte() != null && usuario.getBloqueadoAte().isAfter(agora)) {
			auditoria.registrar("LOGIN_BLOQUEADO", usuario.getNome(), identificador, "Tentativa durante bloqueio");
			throw new BadCredentialsException("Credenciais invalidas");
		}
		if (!passwordEncoder.matches(dados.senha(), usuario.getSenhaHash())) {
			int falhas = usuario.getFalhasLogin() + 1;
			usuario.setFalhasLogin(falhas);
			if (falhas >= maxFalhas) {
				usuario.setBloqueadoAte(agora.plusMinutes(bloqueioMinutos));
				usuario.setFalhasLogin(0);
			}
			repository.save(usuario);
			auditoria.registrar("LOGIN_FALHOU", usuario.getNome(), identificador, "Credenciais invalidas");
			throw new BadCredentialsException("Credenciais invalidas");
		}
		usuario.setFalhasLogin(0);
		usuario.setBloqueadoAte(null);
		usuario.setUltimoLoginEm(agora);
		repository.save(usuario);
		auditoria.registrar("LOGIN_SUCESSO", usuario.getNome(), identificador, "Autenticacao concluida");
		return emitirToken(usuario);
	}

	private TokenDTO emitirToken(Usuario usuario) {
		Instant agora = Instant.now();
		JwtClaimsSet claims = JwtClaimsSet.builder()
				.issuer("scp-cob4").issuedAt(agora).expiresAt(agora.plusSeconds(expiracaoSegundos))
				.subject(usuario.getId().toString())
				.claim("nome", usuario.getNome())
				.claim("identificador", usuario.getIdentificador())
				.claim("perfil", usuario.getPerfil().name())
				.claim("scope", usuario.getPerfil().name())
				.claim("versaoToken", usuario.getVersaoToken())
				.build();
		String token = jwtEncoder.encode(JwtEncoderParameters.from(
				JwsHeader.with(MacAlgorithm.HS256).build(), claims)).getTokenValue();
		return new TokenDTO(token, expiracaoSegundos, dto(usuario));
	}

	@Transactional(readOnly = true)
	public UsuarioDTO atual() {
		return dto(usuarioAtualPersistido());
	}

	@Transactional(readOnly = true)
	public List<UsuarioDTO> listar() {
		return repository.findAll().stream().map(this::dto).toList();
	}

	@Transactional(readOnly = true)
	public PaginaDTO<UsuarioDTO> listarPagina(int pagina, int tamanho) {
		return PaginaDTO.de(repository.findAll(PageRequest.of(pagina, tamanho, Sort.by("nome").ascending())), this::dto);
	}

	@Transactional
	public UsuarioDTO criar(SalvarUsuarioDTO dados) {
		if (dados.senha() == null || dados.senha().isBlank()) {
			throw new IllegalArgumentException("Senha obrigatoria para novo usuario");
		}
		validarSenha(dados.senha());
		if (repository.existsByIdentificadorIgnoreCase(dados.identificador().trim())) {
			throw new IllegalArgumentException("Identificador ja cadastrado");
		}
		Usuario criado = aplicar(new Usuario(), dados);
		criado.setTrocaSenhaObrigatoria(true);
		criado = repository.save(criado);
		var autor = usuarioAtual.atual();
		auditoria.registrar("USUARIO_CRIADO", autor.nome(), autor.identificador(),
				"Usuario criado: " + criado.getIdentificador() + " perfil " + criado.getPerfil());
		return dto(criado);
	}

	@Transactional
	public UsuarioDTO atualizar(Long id, SalvarUsuarioDTO dados) {
		Usuario usuario = repository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Usuario nao encontrado"));
		repository.findByIdentificadorIgnoreCase(dados.identificador().trim())
				.filter(outro -> !outro.getId().equals(id))
				.ifPresent(outro -> { throw new IllegalArgumentException("Identificador ja cadastrado"); });
		if (usuario.getPerfil() == PerfilUsuario.ADMINISTRADOR && usuario.isAtivo()
				&& (!dados.ativo() || dados.perfil() != PerfilUsuario.ADMINISTRADOR)
				&& repository.countByPerfilAndAtivoTrue(PerfilUsuario.ADMINISTRADOR) <= 1) {
			throw new IllegalStateException("O ultimo administrador ativo nao pode ser removido ou desativado");
		}
		boolean invalidaSessao = usuario.isAtivo() != dados.ativo() || usuario.getPerfil() != dados.perfil()
				|| (dados.senha() != null && !dados.senha().isBlank());
		if (dados.senha() != null && !dados.senha().isBlank()) validarSenha(dados.senha());
		usuario = aplicar(usuario, dados);
		if (dados.senha() != null && !dados.senha().isBlank()) usuario.setTrocaSenhaObrigatoria(true);
		if (invalidaSessao) usuario.setVersaoToken(usuario.getVersaoToken() + 1);
		usuario = repository.save(usuario);
		var autor = usuarioAtual.atual();
		auditoria.registrar("USUARIO_ATUALIZADO", autor.nome(), autor.identificador(),
				"Usuario atualizado: " + usuario.getIdentificador());
		return dto(usuario);
	}

	@Transactional
	public UsuarioDTO alterarPresenca(boolean presente) {
		Usuario usuario = usuarioAtualPersistido();
		usuario.setPresente(presente);
		repository.save(usuario);
		auditoria.registrar("PRESENCA_ALTERADA", usuario.getNome(), usuario.getIdentificador(),
				"Presenca: " + presente);
		return dto(usuario);
	}

	@Transactional
	public void alterarSenha(AlterarSenhaDTO dados) {
		Usuario usuario = usuarioAtualPersistido();
		if (!passwordEncoder.matches(dados.senhaAtual(), usuario.getSenhaHash())) {
			throw new BadCredentialsException("Senha atual invalida");
		}
		if (passwordEncoder.matches(dados.novaSenha(), usuario.getSenhaHash())) {
			throw new IllegalArgumentException("A nova senha deve ser diferente da senha atual");
		}
		validarSenha(dados.novaSenha());
		usuario.setSenhaHash(passwordEncoder.encode(dados.novaSenha()));
		usuario.setTrocaSenhaObrigatoria(false);
		usuario.setSenhaAlteradaEm(OffsetDateTime.now());
		usuario.setVersaoToken(usuario.getVersaoToken() + 1);
		repository.save(usuario);
		auditoria.registrar("SENHA_ALTERADA", usuario.getNome(), usuario.getIdentificador(),
				"Senha alterada; sessoes anteriores revogadas");
	}

	@Transactional
	public void logout() {
		Usuario usuario = usuarioAtualPersistido();
		usuario.setVersaoToken(usuario.getVersaoToken() + 1);
		repository.save(usuario);
		auditoria.registrar("LOGOUT", usuario.getNome(), usuario.getIdentificador(), "Sessao revogada");
	}

	private Usuario usuarioAtualPersistido() {
		return repository.findById(usuarioAtual.atual().id()).filter(Usuario::isAtivo)
				.orElseThrow(() -> new AccessDeniedException("Usuario inativo ou inexistente"));
	}

	private Usuario aplicar(Usuario usuario, SalvarUsuarioDTO dados) {
		usuario.setNome(dados.nome().trim());
		usuario.setIdentificador(dados.identificador().trim().toLowerCase(Locale.ROOT));
		usuario.setPerfil(dados.perfil());
		usuario.setAtivo(dados.ativo());
		usuario.setPresente(dados.presente());
		usuario.setCargaMaxima(dados.cargaMaxima());
		if (dados.senha() != null && !dados.senha().isBlank()) {
			usuario.setSenhaHash(passwordEncoder.encode(dados.senha()));
			usuario.setSenhaAlteradaEm(OffsetDateTime.now());
		}
		return usuario;
	}

	private void validarSenha(String senha) {
		String minuscula = senha.toLowerCase(Locale.ROOT);
		if (senha.length() < 12 || senha.length() > 72
				|| !senha.matches(".*[A-Z].*") || !senha.matches(".*[a-z].*")
				|| !senha.matches(".*\\d.*") || !senha.matches(".*[^A-Za-z0-9].*")
				|| SENHAS_PROIBIDAS.contains(minuscula)) {
			throw new IllegalArgumentException(
					"A senha deve ter 12 a 72 caracteres, maiuscula, minuscula, numero e simbolo, e nao pode ser comum");
		}
	}

	public UsuarioDTO dto(Usuario usuario) {
		return new UsuarioDTO(usuario.getId(), usuario.getNome(), usuario.getIdentificador(), usuario.getPerfil(),
				usuario.isAtivo(), usuario.isPresente(), usuario.getCargaMaxima(),
				usuario.isTrocaSenhaObrigatoria());
	}
}
