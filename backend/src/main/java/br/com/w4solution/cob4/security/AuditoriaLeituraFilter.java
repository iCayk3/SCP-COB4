package br.com.w4solution.cob4.security;
import br.com.w4solution.cob4.services.usuario.AuditoriaSegurancaService;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.Set;

@Component
public class AuditoriaLeituraFilter extends OncePerRequestFilter {
	private static final Set<String> PRIVILEGIADOS=Set.of("SUPERVISOR","FINANCEIRO","JURIDICO","GERENTE","ADMINISTRADOR");
	private final AuditoriaSegurancaService auditoria;
	public AuditoriaLeituraFilter(AuditoriaSegurancaService a){auditoria=a;}
	@Override protected void doFilterInternal(HttpServletRequest req,HttpServletResponse res,FilterChain chain)throws ServletException,IOException{
		chain.doFilter(req,res);if(!"GET".equals(req.getMethod())||res.getStatus()>=400||!req.getRequestURI().startsWith("/api/"))return;
		var auth=SecurityContextHolder.getContext().getAuthentication();if(auth!=null&&auth.getPrincipal() instanceof Jwt jwt&&PRIVILEGIADOS.contains(jwt.getClaimAsString("perfil"))){
			auditoria.registrar("LEITURA_PRIVILEGIADA",jwt.getClaimAsString("nome"),jwt.getClaimAsString("identificador"),"Leitura autorizada em "+normalizar(req.getRequestURI()));}
	}
	private String normalizar(String uri){return uri.replaceAll("(?<=/clientes/)[^/]+","{titular}").replaceAll("(?<=/)[0-9]{6,}","{id}").replaceAll("(?<=/)[0-9A-Za-z.-]{20,}","{referencia}");}
}
