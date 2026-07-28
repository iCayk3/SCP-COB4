package br.com.w4solution.cob4.config;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class SchemaCompatibilidadeInicializadorTests {

	@Test
	void deveIncluirTodosOsStatusDaCobrancaNaRestricao() {
		assertThat(SchemaCompatibilidadeInicializador.statusPermitidosSql())
				.isEqualTo("'ABERTA', 'EM_ANDAMENTO', 'ENCERRADA', 'PAGA', 'CANCELADA'");
	}
}
