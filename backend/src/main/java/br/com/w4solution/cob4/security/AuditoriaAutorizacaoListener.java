package br.com.w4solution.cob4.security;

import br.com.w4solution.cob4.services.usuario.AuditoriaSegurancaService;
import org.springframework.context.event.EventListener;
import org.springframework.security.authorization.event.AuthorizationDeniedEvent;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

@Component
public class AuditoriaAutorizacaoListener {
	private final AuditoriaSegurancaService auditoria;

	public AuditoriaAutorizacaoListener(AuditoriaSegurancaService auditoria) {
		this.auditoria = auditoria;
	}

	@EventListener
	public void negado(AuthorizationDeniedEvent<?> evento) {
		var authentication = evento.getAuthentication().get();
		if (authentication != null && authentication.getPrincipal() instanceof Jwt jwt) {
			auditoria.registrar("ACESSO_NEGADO", jwt.getClaimAsString("nome"),
					jwt.getClaimAsString("identificador"), "Operacao sem permissao");
		}
	}
}
