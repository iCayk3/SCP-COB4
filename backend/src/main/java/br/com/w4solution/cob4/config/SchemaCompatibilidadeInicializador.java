package br.com.w4solution.cob4.config;

import br.com.w4solution.cob4.domain.Cobranca;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;
import java.util.Arrays;
import java.util.stream.Collectors;

/**
 * Corrige restrições geradas pelo Hibernate em versões anteriores do modelo.
 * O ddl-auto=update cria colunas, mas não atualiza CHECK constraints de enums
 * quando novos valores são adicionados.
 */
@Component
@RequiredArgsConstructor
public class SchemaCompatibilidadeInicializador implements ApplicationRunner {

	private final DataSource dataSource;
	private final JdbcTemplate jdbcTemplate;

	@Override
	public void run(ApplicationArguments args) throws Exception {
		try (Connection connection = dataSource.getConnection()) {
			if (!"PostgreSQL".equalsIgnoreCase(connection.getMetaData().getDatabaseProductName())) {
				return;
			}
		}

		jdbcTemplate.execute("alter table cobrancas drop constraint if exists cobrancas_status_check");
		jdbcTemplate.execute("""
				alter table cobrancas
				add constraint cobrancas_status_check
				check (status in (%s))
				""".formatted(statusPermitidosSql()));
	}

	static String statusPermitidosSql() {
		return Arrays.stream(Cobranca.Status.values())
				.map(Enum::name)
				.map(valor -> "'" + valor + "'")
				.collect(Collectors.joining(", "));
	}
}
