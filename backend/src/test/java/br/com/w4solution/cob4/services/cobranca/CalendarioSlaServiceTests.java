package br.com.w4solution.cob4.services.cobranca;

import org.junit.jupiter.api.Test;

import java.time.*;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

class CalendarioSlaServiceTests {
	private final ZoneId zona = ZoneId.of("America/Sao_Paulo");

	@Test
	void pulaFimDeSemanaEFeriado() {
		var calendario = new CalendarioSlaService(zona, LocalTime.of(8, 0), LocalTime.of(18, 0),
				Set.of(LocalDate.of(2026, 9, 7)));
		var sexta = ZonedDateTime.of(2026, 9, 4, 17, 0, 0, 0, zona).toOffsetDateTime();

		var vencimento = calendario.adicionarHorasUteis(sexta, 2);

		assertThat(vencimento).isEqualTo(
				ZonedDateTime.of(2026, 9, 8, 9, 0, 0, 0, zona).toOffsetDateTime());
	}

	@Test
	void iniciaContagemNaProximaJornada() {
		var calendario = new CalendarioSlaService(zona, LocalTime.of(8, 0), LocalTime.of(18, 0), Set.of());
		var noite = ZonedDateTime.of(2026, 7, 29, 21, 0, 0, 0, zona).toOffsetDateTime();

		assertThat(calendario.adicionarHorasUteis(noite, 1)).isEqualTo(
				ZonedDateTime.of(2026, 7, 30, 9, 0, 0, 0, zona).toOffsetDateTime());
	}

	@Test
	void pausaNoFimDeSemanaAcumulaSomenteTempoUtil() {
		var calendario = new CalendarioSlaService(zona, LocalTime.of(8, 0), LocalTime.of(18, 0), Set.of());
		var sexta = ZonedDateTime.of(2026, 9, 4, 17, 0, 0, 0, zona).toOffsetDateTime();
		var segunda = ZonedDateTime.of(2026, 9, 7, 9, 0, 0, 0, zona).toOffsetDateTime();

		assertThat(calendario.duracaoUtilEntre(sexta, segunda)).isEqualTo(Duration.ofHours(2));
	}
}
