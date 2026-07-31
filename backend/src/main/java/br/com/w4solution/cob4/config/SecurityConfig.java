package br.com.w4solution.cob4.config;

import com.nimbusds.jose.jwk.source.ImmutableSecret;
import com.nimbusds.jose.proc.SecurityContext;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.oauth2.server.resource.web.authentication.BearerTokenAuthenticationFilter;
import org.springframework.security.oauth2.server.resource.web.BearerTokenResolver;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import br.com.w4solution.cob4.security.EstadoUsuarioFilter;
import br.com.w4solution.cob4.security.AuditoriaLeituraFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {
	@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity http, EstadoUsuarioFilter estadoUsuarioFilter,
			BearerTokenResolver bearerTokenResolver, AuditoriaLeituraFilter auditoriaLeituraFilter) throws Exception {
		return http
				.csrf(csrf -> csrf.disable())
				.cors(cors -> {})
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.authorizeHttpRequests(auth -> auth
						.requestMatchers("/api/auth/login", "/api-docs/**", "/swagger-ui.html", "/swagger-ui/**",
								"/actuator/health", "/actuator/health/**", "/actuator/prometheus").permitAll()
						.anyRequest().authenticated())
				.oauth2ResourceServer(oauth -> oauth
						.bearerTokenResolver(bearerTokenResolver)
						.authenticationEntryPoint((request, response, error) -> {
							response.setStatus(401);
							response.setContentType("application/json");
							response.getWriter().write("{\"status\":401,\"message\":\"Autenticacao necessaria\"}");
						})
						.accessDeniedHandler((request, response, error) -> {
							response.setStatus(403);
							response.setContentType("application/json");
							response.getWriter().write("{\"status\":403,\"message\":\"Acesso negado\"}");
						})
						.jwt(jwt -> {}))
				.exceptionHandling(ex -> ex
						.authenticationEntryPoint((request, response, error) -> {
							response.setStatus(401);
							response.setContentType("application/json");
							response.getWriter().write("{\"status\":401,\"message\":\"Autenticacao necessaria\"}");
						})
						.accessDeniedHandler((request, response, error) -> {
							response.setStatus(403);
							response.setContentType("application/json");
							response.getWriter().write("{\"status\":403,\"message\":\"Acesso negado\"}");
						}))
				.headers(headers -> headers
						.contentSecurityPolicy(csp -> csp.policyDirectives(
								"default-src 'self'; frame-ancestors 'none'; object-src 'none'"))
						.frameOptions(frame -> frame.deny()))
				.addFilterAfter(estadoUsuarioFilter, BearerTokenAuthenticationFilter.class)
				.addFilterAfter(auditoriaLeituraFilter, EstadoUsuarioFilter.class)
				.build();
	}
	@Bean FilterRegistrationBean<AuditoriaLeituraFilter> desabilitarRegistroAutomatico(AuditoriaLeituraFilter f){var r=new FilterRegistrationBean<>(f);r.setEnabled(false);return r;}

	@Bean
	PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	SecretKey jwtSecretKey(@Value("${sgc.security.jwt.secret}") String segredo, Environment environment) {
		if (Arrays.asList(environment.getActiveProfiles()).contains("prod")
				&& segredo.startsWith("troque-esta-chave")) {
			throw new IllegalStateException("SGC_JWT_SECRET forte e obrigatorio no perfil prod");
		}
		byte[] bytes = segredo.getBytes(StandardCharsets.UTF_8);
		if (bytes.length < 32) throw new IllegalStateException("SGC_JWT_SECRET deve ter ao menos 32 caracteres");
		return new SecretKeySpec(bytes, "HmacSHA256");
	}

	@Bean
	JwtDecoder jwtDecoder(SecretKey key) {
		NimbusJwtDecoder decoder = NimbusJwtDecoder.withSecretKey(key).macAlgorithm(MacAlgorithm.HS256).build();
		decoder.setJwtValidator(JwtValidators.createDefaultWithIssuer("scp-cob4"));
		return decoder;
	}

	@Bean
	JwtEncoder jwtEncoder(SecretKey key) {
		return new NimbusJwtEncoder(new ImmutableSecret<SecurityContext>(key));
	}

	@Bean
	CorsConfigurationSource corsConfigurationSource(
			@Value("${sgc.security.cors.origens:http://localhost:5173}") String origens) {
		CorsConfiguration config = new CorsConfiguration();
		config.setAllowedOrigins(Arrays.stream(origens.split(",")).map(String::trim).filter(s -> !s.isBlank()).toList());
		config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
		config.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept"));
		config.setExposedHeaders(List.of("WWW-Authenticate"));
		config.setAllowCredentials(true);
		config.setMaxAge(3600L);
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/api/**", config);
		return source;
	}

	@Bean
	BearerTokenResolver bearerTokenResolver() {
		return request -> {
			if ("/api/auth/login".equals(request.getRequestURI())) return null;
			if (request.getCookies() == null) return null;
			return Arrays.stream(request.getCookies())
					.filter(cookie -> "SGC_SESSION".equals(cookie.getName()))
					.map(jakarta.servlet.http.Cookie::getValue)
					.findFirst().orElse(null);
		};
	}
}
