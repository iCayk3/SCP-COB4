package br.com.w4solution.cob4.security;

import jakarta.servlet.*;import jakarta.servlet.http.*;
import org.slf4j.MDC;import org.springframework.beans.factory.annotation.Value;import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;import java.time.*;import java.util.*;import java.util.concurrent.*;import java.util.concurrent.atomic.AtomicInteger;

@Component
public class ProtecaoApiFilter extends OncePerRequestFilter {
	private record Janela(long minuto,AtomicInteger total){}
	private final Set<String> origens; private final int loginMax; private final int rbxMax;
	private final ConcurrentMap<String,Janela> limites=new ConcurrentHashMap<>();
	public ProtecaoApiFilter(@Value("${sgc.security.cors.origens:http://localhost:5173}")String o,
			@Value("${sgc.security.rate-limit.login-por-minuto:20}")int l,@Value("${sgc.security.rate-limit.rbx-por-minuto:60}")int r){
		origens=new HashSet<>(Arrays.stream(o.split(",")).map(String::trim).filter(s->!s.isBlank()).toList());loginMax=l;rbxMax=r;}
	@Override protected void doFilterInternal(HttpServletRequest req,HttpServletResponse res,FilterChain chain)throws ServletException,IOException{
		String trace=Optional.ofNullable(req.getHeader("X-Trace-Id")).filter(v->v.matches("[A-Za-z0-9._-]{8,100}")).orElseGet(()->UUID.randomUUID().toString());
		MDC.put("traceId",trace);res.setHeader("X-Trace-Id",trace);
		try{
			if(inseguro(req)&&temCookieSessao(req)){String origem=req.getHeader("Origin");String referer=req.getHeader("Referer");if(origem==null&&referer!=null)origem=origemDoReferer(referer);if(origem!=null&&!origens.contains(origem)){erro(res,403,"ORIGEM_NAO_PERMITIDA","Origem nao autorizada",trace);return;}}
			String uri=req.getRequestURI();int max=uri.equals("/api/auth/login")?loginMax:uri.contains("/rbx")?rbxMax:0;
			if(max>0&&!permitir(req.getRemoteAddr()+":"+uri,max)){res.setHeader("Retry-After","60");erro(res,429,"LIMITE_EXCEDIDO","Muitas requisicoes; tente novamente em instantes",trace);return;}
			chain.doFilter(req,res);
		}finally{MDC.remove("traceId");}
	}
	private boolean permitir(String chave,int max){long min=Instant.now().getEpochSecond()/60;Janela j=limites.compute(chave,(k,v)->v==null||v.minuto()!=min?new Janela(min,new AtomicInteger()):v);return j.total().incrementAndGet()<=max;}
	private boolean inseguro(HttpServletRequest r){return !Set.of("GET","HEAD","OPTIONS","TRACE").contains(r.getMethod());}
	private boolean temCookieSessao(HttpServletRequest r){return r.getCookies()!=null&&Arrays.stream(r.getCookies()).anyMatch(c->c.getName().equals("SGC_SESSION"));}
	private String origemDoReferer(String valor){try{var u=java.net.URI.create(valor);return u.getScheme()+"://"+u.getAuthority();}catch(Exception e){return "INVALIDA";}}
	private void erro(HttpServletResponse r,int status,String codigo,String msg,String trace)throws IOException{r.setStatus(status);r.setContentType("application/json");r.getWriter().write("{\"timestamp\":\""+OffsetDateTime.now()+"\",\"status\":"+status+",\"codigo\":\""+codigo+"\",\"message\":\""+msg+"\",\"campos\":{},\"traceId\":\""+trace+"\"}");}
}
