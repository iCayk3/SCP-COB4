package br.com.w4solution.cob4.security;

import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

@Service
public class UsuarioAtualService {
	public UsuarioAutenticado atual() {
		Authentication autenticacao = SecurityContextHolder.getContext().getAuthentication();
		if (autenticacao == null || !autenticacao.isAuthenticated()
				|| autenticacao instanceof AnonymousAuthenticationToken
				|| !(autenticacao.getPrincipal() instanceof Jwt jwt)) {
			throw new org.springframework.security.authentication.AuthenticationCredentialsNotFoundException(
					"Usuario nao autenticado");
		}
		return new UsuarioAutenticado(
				Long.valueOf(jwt.getSubject()),
				jwt.getClaimAsString("nome"),
				jwt.getClaimAsString("identificador"),
				PerfilUsuario.valueOf(jwt.getClaimAsString("perfil")));
	}
}
