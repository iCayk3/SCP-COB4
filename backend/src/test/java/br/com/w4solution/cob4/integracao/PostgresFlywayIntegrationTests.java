package br.com.w4solution.cob4.integracao;

import org.flywaydb.core.Flyway;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Testcontainers(disabledWithoutDocker = true)
class PostgresFlywayIntegrationTests {
	@Container
	static final PostgreSQLContainer<?> POSTGRES = new PostgreSQLContainer<>("postgres:16-alpine")
			.withDatabaseName("cob4_it").withUsername("cob4").withPassword("cob4");

	@DynamicPropertySource
	static void propriedades(DynamicPropertyRegistry registry) {
		registry.add("spring.datasource.url", POSTGRES::getJdbcUrl);
		registry.add("spring.datasource.username", POSTGRES::getUsername);
		registry.add("spring.datasource.password", POSTGRES::getPassword);
		registry.add("spring.jpa.hibernate.ddl-auto", () -> "validate");
		registry.add("spring.flyway.enabled", () -> "true");
		registry.add("sgc.security.jwt.secret", () -> "segredo-integracao-postgres-com-mais-de-32-caracteres");
		registry.add("sgc.security.usuario-inicial.senha", () -> "Alterar@123");
		registry.add("sgc.lgpd.anexos.chave", () -> "chave-integracao-anexos-32-caracteres");
		registry.add("sgc.demo.dados-ficticios", () -> "false");
		registry.add("spring.task.scheduling.enabled", () -> "false");
	}

	@Autowired Flyway flyway;
	@Autowired JdbcTemplate jdbc;

	@Test
	void aplicaTodasMigrationsEValidaIndicesP0EP1() {
		var info = flyway.info().current();
		assertThat(info).isNotNull();
		assertThat(info.getVersion().getVersion()).isEqualTo("12");
		Integer indices = jdbc.queryForObject("""
				select count(*) from pg_indexes
				where schemaname = 'public' and indexname in
				('uk_cobranca_ciclo_ativo_contrato','idx_cobranca_fila_operacional',
				 'idx_tarefa_responsavel_status_prazo')
				""", Integer.class);
		assertThat(indices).isEqualTo(3);
		Integer estruturasP1 = jdbc.queryForObject("""
				select count(*) from information_schema.columns where table_schema='public' and
				((table_name='atendimentos' and column_name in ('duracao_segundos','retorno_agendado_em'))
				 or (table_name='fluxos_cobranca' and column_name in ('versao','status_versao','row_version')))
				""", Integer.class);
		assertThat(estruturasP1).isEqualTo(5);
	}
}
