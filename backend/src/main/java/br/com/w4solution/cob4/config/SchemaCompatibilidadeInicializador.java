package br.com.w4solution.cob4.config;

import br.com.w4solution.cob4.domain.Cobranca;
import java.util.Arrays;
import java.util.stream.Collectors;

/**
 * Corrige restrições geradas pelo Hibernate em versões anteriores do modelo.
 * O ddl-auto=update cria colunas, mas não atualiza CHECK constraints de enums
 * quando novos valores são adicionados.
 */
final class SchemaCompatibilidadeInicializador {

	private SchemaCompatibilidadeInicializador() {
	}

	static String statusPermitidosSql() {
		return Arrays.stream(Cobranca.Status.values())
				.map(Enum::name)
				.map(valor -> "'" + valor + "'")
				.collect(Collectors.joining(", "));
	}
}
