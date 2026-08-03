package br.com.w4solution.cob4.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.media.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

	@Bean
	public OpenAPI cob4OpenAPI() {
		var erroApi = new ObjectSchema()
				.addProperty("timestamp", new DateTimeSchema())
				.addProperty("status", new IntegerSchema().format("int32"))
				.addProperty("codigo", new StringSchema())
				.addProperty("message", new StringSchema())
				.addProperty("campos", new ObjectSchema().description("Erros de validacao indexados pelo nome do campo"))
				.addProperty("traceId", new StringSchema());
		return new OpenAPI()
				.components(new Components()
						.addSchemas("ErroApiDTO", erroApi)
						.addSecuritySchemes("cookieAuth", new SecurityScheme()
								.type(SecurityScheme.Type.APIKEY).in(SecurityScheme.In.COOKIE).name("SGC_SESSION")))
				.addSecurityItem(new SecurityRequirement().addList("cookieAuth"))
				.info(new Info()
						.title("SGC Cob4 - API Operacional")
						.version("1.1.0")
						.description("""
								Contrato HTTP consumido pelo frontend do SGC.
								O processo e aberto por cliente e contrato, agrega um ou mais titulos
								vencidos e preserva historico entre transicoes. A RBX e a fonte financeira atual.
								Erros usam o esquema ErroApiDTO e respostas paginadas usam itens/pagina/tamanho/totais.
								Valores monetarios usam decimal em BRL; datas de instante usam ISO-8601 com offset.
								Configuracoes versionadas rejeitam rowVersion desatualizada com HTTP 409.
								""")
						.contact(new Contact().name("W4 Solution")));
	}
}
