package br.com.w4solution.cob4.config;

import br.com.w4solution.cob4.domain.Usuario;
import br.com.w4solution.cob4.repositories.UsuarioRepository;
import br.com.w4solution.cob4.security.PerfilUsuario;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.core.env.Environment;

import java.time.OffsetDateTime;
import java.util.Arrays;

@Component
public class UsuarioInicializador implements CommandLineRunner {
	private final UsuarioRepository repository;
	private final PasswordEncoder passwordEncoder;
	private final String senhaInicial;
	private final Environment environment;

	public UsuarioInicializador(UsuarioRepository repository, PasswordEncoder passwordEncoder,
			@Value("${sgc.security.usuario-inicial.senha}") String senhaInicial, Environment environment) {
		this.repository = repository;
		this.passwordEncoder = passwordEncoder;
		this.senhaInicial = senhaInicial;
		this.environment = environment;
	}

	@Override
	public void run(String... args) {
		if (Arrays.asList(environment.getActiveProfiles()).contains("prod")
				&& "Alterar@123".equals(senhaInicial)) {
			throw new IllegalStateException("SGC_USUARIO_INICIAL_SENHA forte e obrigatoria no perfil prod");
		}
		criarSeAusente("Administrador", "administrador", PerfilUsuario.ADMINISTRADOR);
		criarSeAusente("Gerente", "gerente", PerfilUsuario.GERENTE);
		criarSeAusente("Supervisor", "supervisor", PerfilUsuario.SUPERVISOR);
		criarSeAusente("Operador", "operador", PerfilUsuario.OPERADOR);
	}

	private void criarSeAusente(String nome, String identificador, PerfilUsuario perfil) {
		if (repository.existsByIdentificadorIgnoreCase(identificador)) return;
		Usuario usuario = new Usuario();
		usuario.setNome(nome);
		usuario.setIdentificador(identificador);
		usuario.setSenhaHash(passwordEncoder.encode(senhaInicial));
		usuario.setPerfil(perfil);
		usuario.setAtivo(true);
		usuario.setPresente(perfil == PerfilUsuario.OPERADOR);
		usuario.setCargaMaxima(50);
		usuario.setTrocaSenhaObrigatoria(true);
		usuario.setCriadoEm(OffsetDateTime.now());
		usuario.setAtualizadoEm(OffsetDateTime.now());
		repository.save(usuario);
	}
}
