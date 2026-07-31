package br.com.w4solution.cob4.security;
import com.fasterxml.jackson.databind.*;
import com.fasterxml.jackson.databind.node.*;
import org.springframework.core.MethodParameter;
import org.springframework.http.*;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;
import java.util.*;

@ControllerAdvice
public class MascaramentoDadosAdvice implements ResponseBodyAdvice<Object> {
	private static final Set<String> RESTRITOS=Set.of("OPERADOR","CAMPO"); private final ObjectMapper mapper;
	public MascaramentoDadosAdvice(ObjectMapper mapper){this.mapper=mapper;}
	@Override public boolean supports(MethodParameter p,Class<? extends HttpMessageConverter<?>> c){return true;}
	@Override public Object beforeBodyWrite(Object body,MethodParameter p,MediaType media,Class<? extends HttpMessageConverter<?>> c,org.springframework.http.server.ServerHttpRequest req,org.springframework.http.server.ServerHttpResponse res){
		if(body==null||!MediaType.APPLICATION_JSON.isCompatibleWith(media)||!restrito())return body;JsonNode n=mapper.valueToTree(body);mascarar(n);return n;}
	private boolean restrito(){var a=SecurityContextHolder.getContext().getAuthentication();return a!=null&&a.getPrincipal() instanceof Jwt j&&RESTRITOS.contains(j.getClaimAsString("perfil"));}
	private void mascarar(JsonNode n){if(n.isArray())n.forEach(this::mascarar);else if(n.isObject()){var o=(ObjectNode)n;var campos=new ArrayList<String>();o.fieldNames().forEachRemaining(campos::add);for(String k:campos){var v=o.get(k);String x=k.toLowerCase(Locale.ROOT);if(v.isTextual()&&(x.equals("cpf")||x.contains("cpfagregador")))o.put(k,cpf(v.asText()));else if(v.isTextual()&&x.contains("telefone"))o.put(k,telefone(v.asText()));else if(v.isTextual()&&x.contains("email"))o.put(k,email(v.asText()));else mascarar(v);}}}
	private String cpf(String v){String d=v.replaceAll("\\D","");return d.length()<4?"***":"***.***.***-"+d.substring(d.length()-2);}
	private String telefone(String v){String d=v.replaceAll("\\D","");return d.length()<4?"***":"(**) *****-"+d.substring(d.length()-4);}
	private String email(String v){int a=v.indexOf('@');return a<1?"***":v.substring(0,1)+"***"+v.substring(a);}
}
