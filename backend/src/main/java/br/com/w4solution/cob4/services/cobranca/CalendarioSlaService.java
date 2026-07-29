package br.com.w4solution.cob4.services.cobranca;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class CalendarioSlaService {
	private final ZoneId zona;
	private final LocalTime inicio;
	private final LocalTime fim;
	private final Set<LocalDate> feriados;

	@Autowired
	public CalendarioSlaService(
			@Value("${sgc.cobranca.sla.zona:America/Sao_Paulo}") String zona,
			@Value("${sgc.cobranca.sla.jornada-inicio:08:00}") String inicio,
			@Value("${sgc.cobranca.sla.jornada-fim:18:00}") String fim,
			@Value("${sgc.cobranca.sla.feriados:}") String feriados) {
		this(ZoneId.of(zona), LocalTime.parse(inicio), LocalTime.parse(fim), parseFeriados(feriados));
	}

	CalendarioSlaService(ZoneId zona, LocalTime inicio, LocalTime fim, Set<LocalDate> feriados) {
		if (!fim.isAfter(inicio)) throw new IllegalArgumentException("Fim da jornada de SLA deve ser após o início");
		this.zona = zona;
		this.inicio = inicio;
		this.fim = fim;
		this.feriados = Set.copyOf(feriados);
	}

	public OffsetDateTime adicionarHorasUteis(OffsetDateTime origem, long horas) {
		return adicionarTempoUtil(origem, Duration.ofHours(horas));
	}

	public OffsetDateTime adicionarTempoUtil(OffsetDateTime origem, Duration duracao) {
		if (duracao.isNegative()) throw new IllegalArgumentException("Duração do SLA não pode ser negativa");
		ZonedDateTime cursor = proximoInstanteUtil(origem.atZoneSameInstant(zona));
		Duration restante = duracao;
		while (!restante.isZero()) {
			ZonedDateTime fimDoDia = cursor.toLocalDate().atTime(fim).atZone(zona);
			Duration disponivel = Duration.between(cursor, fimDoDia);
			if (restante.compareTo(disponivel) <= 0) return cursor.plus(restante).toOffsetDateTime();
			restante = restante.minus(disponivel);
			cursor = proximoInstanteUtil(cursor.toLocalDate().plusDays(1).atStartOfDay(zona));
		}
		return cursor.toOffsetDateTime();
	}

	public Duration duracaoUtilEntre(OffsetDateTime inicioPeriodo, OffsetDateTime fimPeriodo) {
		if (fimPeriodo.isBefore(inicioPeriodo)) throw new IllegalArgumentException("Fim anterior ao início da pausa");
		ZonedDateTime inicioLocal = inicioPeriodo.atZoneSameInstant(zona);
		ZonedDateTime fimLocal = fimPeriodo.atZoneSameInstant(zona);
		Duration total = Duration.ZERO;
		for (LocalDate data = inicioLocal.toLocalDate(); !data.isAfter(fimLocal.toLocalDate()); data = data.plusDays(1)) {
			if (!diaUtil(data)) continue;
			ZonedDateTime abertura = data.atTime(inicio).atZone(zona);
			ZonedDateTime fechamento = data.atTime(fim).atZone(zona);
			ZonedDateTime trechoInicio = abertura.isAfter(inicioLocal) ? abertura : inicioLocal;
			ZonedDateTime trechoFim = fechamento.isBefore(fimLocal) ? fechamento : fimLocal;
			if (trechoFim.isAfter(trechoInicio)) total = total.plus(Duration.between(trechoInicio, trechoFim));
		}
		return total;
	}

	private ZonedDateTime proximoInstanteUtil(ZonedDateTime instante) {
		ZonedDateTime cursor = instante;
		while (true) {
			LocalDate data = cursor.toLocalDate();
			if (!diaUtil(data) || !cursor.toLocalTime().isBefore(fim)) {
				cursor = data.plusDays(1).atTime(inicio).atZone(zona);
				continue;
			}
			if (cursor.toLocalTime().isBefore(inicio)) cursor = data.atTime(inicio).atZone(zona);
			return cursor;
		}
	}

	private boolean diaUtil(LocalDate data) {
		return data.getDayOfWeek() != DayOfWeek.SATURDAY
				&& data.getDayOfWeek() != DayOfWeek.SUNDAY
				&& !feriados.contains(data);
	}

	private static Set<LocalDate> parseFeriados(String valor) {
		if (valor == null || valor.isBlank()) return Set.of();
		return Arrays.stream(valor.split(","))
				.map(String::trim).filter(s -> !s.isEmpty())
				.map(s -> LocalDate.parse(s, DateTimeFormatter.ISO_LOCAL_DATE))
				.collect(Collectors.toUnmodifiableSet());
	}
}
