package br.com.w4solution.cob4.controllers;

import br.com.w4solution.cob4.dto.usuario.LoginDTO;
import br.com.w4solution.cob4.dto.usuario.TokenDTO;
import br.com.w4solution.cob4.dto.usuario.UsuarioDTO;
import br.com.w4solution.cob4.dto.usuario.AlterarSenhaDTO;
import br.com.w4solution.cob4.services.usuario.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
	private final UsuarioService service;
	private final boolean cookieSeguro;

	public AuthController(UsuarioService service,
			@Value("${sgc.security.cookie.secure:false}") boolean cookieSeguro) {
		this.service = service;
		this.cookieSeguro = cookieSeguro;
	}

	@PostMapping("/login")
	public TokenDTO login(@Valid @RequestBody LoginDTO dados, HttpServletResponse response) {
		TokenDTO token = service.autenticar(dados);
		response.addHeader(HttpHeaders.SET_COOKIE, cookie(token.token(), token.expiresIn()).toString());
		return new TokenDTO(null, token.expiresIn(), token.usuario());
	}

	@GetMapping("/me")
	public UsuarioDTO me() { return service.atual(); }

	@PutMapping("/senha")
	public void alterarSenha(@Valid @RequestBody AlterarSenhaDTO dados, HttpServletResponse response) {
		service.alterarSenha(dados);
		response.addHeader(HttpHeaders.SET_COOKIE, cookie("", 0).toString());
	}

	@PostMapping("/logout")
	public void logout(HttpServletResponse response) {
		service.logout();
		response.addHeader(HttpHeaders.SET_COOKIE, cookie("", 0).toString());
	}

	private ResponseCookie cookie(String valor, long maxAge) {
		return ResponseCookie.from("SGC_SESSION", valor)
				.httpOnly(true).secure(cookieSeguro).sameSite("Strict")
				.path("/api").maxAge(maxAge).build();
	}
}
