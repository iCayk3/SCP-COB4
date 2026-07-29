package br.com.w4solution.cob4.security;

import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@DirtiesContext
class SegurancaIntegracaoTests {
	@Autowired MockMvc mvc;

	@Test
	void senhaObrigatoriaPerfisRevogacaoECookieHttpOnly() throws Exception {
		Cookie adminInicial = login("administrador", "Alterar@123");
		mvc.perform(get("/api/regras").cookie(adminInicial)).andExpect(status().isForbidden());

		mvc.perform(put("/api/auth/senha").cookie(adminInicial)
				.contentType("application/json")
				.content("""
						{"senhaAtual":"Alterar@123","novaSenha":"NovaSenha@2026"}
						"""))
				.andExpect(status().isOk())
				.andExpect(header().string("Set-Cookie", org.hamcrest.Matchers.containsString("Max-Age=0")));

		Cookie admin = login("administrador", "NovaSenha@2026");
		mvc.perform(get("/api/usuarios").cookie(admin)).andExpect(status().isOk());
		mvc.perform(post("/api/auth/logout").cookie(admin)).andExpect(status().isOk());
		mvc.perform(get("/api/auth/me").cookie(admin)).andExpect(status().isUnauthorized());

		Cookie operadorInicial = login("operador", "Alterar@123");
		mvc.perform(put("/api/auth/senha").cookie(operadorInicial)
				.contentType("application/json")
				.content("""
						{"senhaAtual":"Alterar@123","novaSenha":"SenhaOperador@2026"}
						"""))
				.andExpect(status().isOk());
		Cookie operador = login("operador", "SenhaOperador@2026");
		mvc.perform(get("/api/usuarios").cookie(operador)).andExpect(status().isForbidden());
	}

	private Cookie login(String identificador, String senha) throws Exception {
		MvcResult resultado = mvc.perform(post("/api/auth/login")
				.contentType("application/json")
				.content("{\"identificador\":\"" + identificador + "\",\"senha\":\"" + senha + "\"}"))
				.andExpect(status().isOk())
				.andExpect(header().string("Set-Cookie", org.hamcrest.Matchers.containsString("HttpOnly")))
				.andExpect(header().string("Set-Cookie", org.hamcrest.Matchers.containsString("SameSite=Strict")))
				.andReturn();
		String header = resultado.getResponse().getHeader("Set-Cookie");
		String valor = header.substring("SGC_SESSION=".length(), header.indexOf(';'));
		return new Cookie("SGC_SESSION", valor);
	}
}
