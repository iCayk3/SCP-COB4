package br.com.w4solution.cob4.controllers;

import jakarta.servlet.http.Cookie;import org.junit.jupiter.api.*;import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.annotation.DirtiesContext;import org.springframework.test.context.ActiveProfiles;import org.springframework.test.web.servlet.*;
import static org.hamcrest.Matchers.*;import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest @AutoConfigureMockMvc @ActiveProfiles("test") @DirtiesContext(classMode= DirtiesContext.ClassMode.AFTER_CLASS)
class P1ApiIntegracaoTests{
	@Autowired MockMvc mvc;@Autowired br.com.w4solution.cob4.repositories.UsuarioRepository usuarios;
	@Test void areaTrabalhoEDashboardsPossuemContratosTipados()throws Exception{Cookie admin=ativar("administrador");
		mvc.perform(get("/api/area-trabalho").cookie(admin)).andExpect(status().isOk()).andExpect(jsonPath("$.resumo.fila").isNumber()).andExpect(jsonPath("$.desempenho.atendimentosHoje").isNumber());
		mvc.perform(get("/api/dashboards/operacao").cookie(admin)).andExpect(status().isOk()).andExpect(jsonPath("$.porStatus").isArray());
		mvc.perform(get("/api/dashboards/sla").cookie(admin)).andExpect(status().isOk()).andExpect(jsonPath("$.dentro").isNumber());}
	@Test void catalogoPublicaTodosOsCanais()throws Exception{Cookie admin=ativar("administrador");mvc.perform(get("/api/catalogos/operacionais").cookie(admin)).andExpect(status().isOk()).andExpect(jsonPath("$.canaisAtendimento",hasItems("CHAT","WHATSAPP","TELEFONE","SMS","EMAIL","PRESENCIAL")));}
	@Test void origemHostilEmComandoComCookieEBloqueadaETracePropagado()throws Exception{Cookie admin=ativar("administrador");mvc.perform(post("/api/auth/logout").cookie(admin).header("Referer","https://hostil.invalid/tela")).andExpect(status().isForbidden()).andExpect(header().exists("X-Trace-Id")).andExpect(jsonPath("$.codigo").value("ORIGEM_NAO_PERMITIDA")).andExpect(jsonPath("$.traceId",not(emptyOrNullString())));}
	private Cookie ativar(String id)throws Exception{var u=usuarios.findByIdentificadorIgnoreCase(id).orElseThrow();u.setTrocaSenhaObrigatoria(false);usuarios.saveAndFlush(u);MvcResult r=mvc.perform(post("/api/auth/login").contentType("application/json").content("{\"identificador\":\""+id+"\",\"senha\":\"Alterar@123\"}")).andExpect(status().isOk()).andReturn();String h=r.getResponse().getHeader("Set-Cookie");return new Cookie("SGC_SESSION",h.substring("SGC_SESSION=".length(),h.indexOf(';')));}
}
