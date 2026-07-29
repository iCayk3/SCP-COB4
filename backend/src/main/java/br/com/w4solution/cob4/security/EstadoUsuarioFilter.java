package br.com.w4solution.cob4.security;

import br.com.w4solution.cob4.repositories.UsuarioRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Set;

@Component
public class EstadoUsuarioFilter extends OncePerRequestFilter {
	private static final Set<String> ROTAS_TROCA_SENHA = Set.of(
			"/api/auth/me", "/api/auth/senha", "/api/auth/logout");
	private final UsuarioRepository repository;

	public EstadoUsuarioFilter(UsuarioRepository repository) {
		this.repository = repository;
	}

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
			throws ServletException, IOException {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication != null && authentication.isAuthenticated() && authentication.getPrincipal() instanceof Jwt jwt) {
			var usuario = repository.findById(Long.valueOf(jwt.getSubject())).orElse(null);
			long versaoToken = jwt.getClaim("versaoToken") instanceof Number n ? n.longValue() : -1;
			if (usuario == null || !usuario.isAtivo() || usuario.getVersaoToken() != versaoToken
					|| !usuario.getPerfil().name().equals(jwt.getClaimAsString("perfil"))) {
				responder(response, 401, "Sessao invalida ou revogada");
				return;
			}
			if (usuario.isTrocaSenhaObrigatoria() && !ROTAS_TROCA_SENHA.contains(request.getRequestURI())) {
				responder(response, 403, "Troca de senha obrigatoria");
				return;
			}
		}
		chain.doFilter(request, response);
	}

	private void responder(HttpServletResponse response, int status, String mensagem) throws IOException {
		response.setStatus(status);
		response.setCharacterEncoding(StandardCharsets.UTF_8.name());
		response.setContentType("application/json");
		response.getWriter().write("{\"status\":" + status + ",\"message\":\"" + mensagem + "\"}");
	}
}
