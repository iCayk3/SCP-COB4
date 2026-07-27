package br.com.w4solution.cob4.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

	@Bean
	public OpenAPI cob4OpenAPI() {
		return new OpenAPI()
				.info(new Info()
						.title("Cob4 - API de Funcoes de Dados")
						.version("1.0.0")
						.description("""
								Documentacao dos endpoints do backend Cob4.
								As funcoes de dados sao documentadas pelo contrato do nosso sistema;
								a RBX e apenas a fonte/provider atual.
								""")
						.contact(new Contact().name("W4 Solution")));
	}
}
