package br.com.w4solution.cob4.controllers;

import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
class ContratoApiIntegracaoTests {
	@Autowired MockMvc mvc;
	@Autowired br.com.w4solution.cob4.repositories.UsuarioRepository usuarios;

	@DynamicPropertySource
	static void bancoIsolado(DynamicPropertyRegistry registry) {
		registry.add("spring.datasource.url", () ->
				"jdbc:h2:mem:cob4-contract-test;MODE=PostgreSQL;DATABASE_TO_LOWER=TRUE;DB_CLOSE_DELAY=-1");
	}

	@Test
	void corsAceitaIdempotencyKey() throws Exception {
		mvc.perform(options("/api/cobrancas/sincronizar-rbx")
				.header("Origin", "http://localhost:5173")
				.header("Access-Control-Request-Method", "POST")
				.header("Access-Control-Request-Headers", "Idempotency-Key,Content-Type"))
				.andExpect(status().isOk())
				.andExpect(header().string("Access-Control-Allow-Headers", containsStringIgnoringCase("Idempotency-Key")));
	}

	@Test
	void operadorUsaFilaDaSessaoENaoConsultaIdentificadorArbitrario() throws Exception {
		Cookie operador = ativar("operador");
		mvc.perform(get("/api/cobrancas/minha-fila/pagina").cookie(operador))
				.andExpect(status().isOk()).andExpect(jsonPath("$.itens").isArray());
		mvc.perform(get("/api/cobrancas/fila/outro-operador").cookie(operador))
				.andExpect(status().isForbidden());
	}

	@Test
	void detalheAgregadoEErro404TemContratoEstavel() throws Exception {
		Cookie admin = ativar("administrador");
		mvc.perform(get("/api/processos/DEMO-001").cookie(admin))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.referencia").value("DEMO-001"))
				.andExpect(jsonPath("$.cliente.cpf").value("11122233344"))
				.andExpect(jsonPath("$.boletos", hasSize(1)))
				.andExpect(jsonPath("$.acoesPermitidas").isArray());
		mvc.perform(get("/api/processos/INEXISTENTE").cookie(admin))
				.andExpect(status().isNotFound())
				.andExpect(jsonPath("$.codigo").value("RECURSO_NAO_ENCONTRADO"))
				.andExpect(jsonPath("$.traceId", not(emptyOrNullString())));
	}

	@Test
	void contratoDeErrosCobre400_401_403_404E409() throws Exception {
		mvc.perform(get("/api/processos/DEMO-001"))
				.andExpect(status().isUnauthorized());

		mvc.perform(post("/api/auth/login").contentType("application/json").content("{}"))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.codigo").value("DADOS_INVALIDOS"))
				.andExpect(jsonPath("$.campos.identificador").exists())
				.andExpect(jsonPath("$.traceId", not(emptyOrNullString())));

		Cookie operador = ativar("operador");
		mvc.perform(get("/api/cobrancas/fila/outro-operador").cookie(operador))
				.andExpect(status().isForbidden());

		Cookie admin = ativar("administrador");
		mvc.perform(get("/api/processos/NAO-EXISTE").cookie(admin))
				.andExpect(status().isNotFound());

		mvc.perform(post("/api/cobrancas/DEMO-001/sla/retomar").cookie(admin)
				.contentType("application/json").content("{\"motivo\":\"Teste de conflito\"}"))
				.andExpect(status().isConflict())
				.andExpect(jsonPath("$.codigo").value("CONFLITO_DE_ESTADO"));
	}

	@Test
	void paginacaoRespeitaContratoELimiteMaximo() throws Exception {
		Cookie admin = ativar("administrador");
		mvc.perform(get("/api/processos/DEMO-001/timeline/pagina")
				.param("pagina", "0").param("tamanho", "1000").cookie(admin))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.itens").isArray())
				.andExpect(jsonPath("$.pagina").value(0))
				.andExpect(jsonPath("$.tamanho").value(100))
				.andExpect(jsonPath("$.totalElementos").isNumber())
				.andExpect(jsonPath("$.totalPaginas").isNumber());
	}

	@Test
	void jornadaOperacionalLoginFilaProcessoAtendimentoETimeline() throws Exception {
		Cookie admin = ativar("administrador");
		mvc.perform(get("/api/cobrancas/minha-fila/pagina").cookie(admin))
				.andExpect(status().isOk()).andExpect(jsonPath("$.itens").isArray());
		mvc.perform(get("/api/processos/DEMO-001").cookie(admin))
				.andExpect(status().isOk()).andExpect(jsonPath("$.referencia").value("DEMO-001"));

		mvc.perform(post("/api/processos/DEMO-001/atendimentos").cookie(admin)
				.contentType("application/json")
				.content("""
						{"canal":"CHAT","resultado":"ATENDEU","observacao":"Contato E2E P0",
						 "proximaAcao":"Retornar amanha","operadorNome":"Administrador",
						 "operadorIdentificador":"administrador",
						 "mensagens":[{"autor":"OPERADOR","mensagem":"Teste da jornada P0"}]}
						"""))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.proximaAcao").value("Retornar amanha"));

		mvc.perform(get("/api/processos/DEMO-001/timeline/pagina").cookie(admin))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.itens[?(@.evento == 'ATENDIMENTO_REGISTRADO')]").exists());
	}

	@Test
	void openApiPublicaContratosOperacionaisP0() throws Exception {
		MvcResult resultado = mvc.perform(get("/api-docs"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.paths['/api/processos/{referencia}']").exists())
				.andExpect(jsonPath("$.paths['/api/clientes/{cpf}/visao-360']").exists())
				.andExpect(jsonPath("$.paths['/api/cobrancas/minha-fila/pagina']").exists())
				.andExpect(jsonPath("$.components.schemas.ErroApiDTO").exists())
				.andExpect(jsonPath("$.components.securitySchemes.cookieAuth").exists())
				.andReturn();
		String destino = System.getProperty("sgc.openapi.output");
		if (destino != null && !destino.isBlank()) {
			java.nio.file.Path arquivo = java.nio.file.Path.of(destino).toAbsolutePath().normalize();
			java.nio.file.Files.createDirectories(arquivo.getParent());
			java.nio.file.Files.writeString(arquivo, resultado.getResponse().getContentAsString(),
					java.nio.charset.StandardCharsets.UTF_8);
		}
	}

	private Cookie ativar(String identificador) throws Exception {
		var usuario = usuarios.findByIdentificadorIgnoreCase(identificador).orElseThrow();
		usuario.setTrocaSenhaObrigatoria(false);
		usuarios.saveAndFlush(usuario);
		return login(identificador, "Alterar@123");
	}

	private Cookie login(String identificador, String senha) throws Exception {
		MvcResult resultado = mvc.perform(post("/api/auth/login").contentType("application/json")
				.content("{\"identificador\":\"" + identificador + "\",\"senha\":\"" + senha + "\"}"))
				.andExpect(status().isOk()).andReturn();
		String header = resultado.getResponse().getHeader("Set-Cookie");
		return new Cookie("SGC_SESSION", header.substring("SGC_SESSION=".length(), header.indexOf(';')));
	}
}
