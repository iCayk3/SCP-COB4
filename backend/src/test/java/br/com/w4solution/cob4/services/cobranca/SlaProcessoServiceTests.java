package br.com.w4solution.cob4.services.cobranca;

import br.com.w4solution.cob4.domain.Cobranca;
import br.com.w4solution.cob4.repositories.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.*;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SlaProcessoServiceTests {
	@Mock CobrancaRepository cobrancaRepository;
	@Mock ProcessoTimelineRepository timelineRepository;
	@Mock TarefaCobrancaRepository tarefaRepository;
	@Mock NotificacaoSlaService notificacao;
	private SlaProcessoService service;

	@BeforeEach
	void configurar() {
		var calendario = new CalendarioSlaService(ZoneId.of("America/Sao_Paulo"),
				LocalTime.of(8, 0), LocalTime.of(18, 0), Set.of());
		service = new SlaProcessoService(cobrancaRepository, timelineRepository, tarefaRepository,
				calendario, notificacao, "0,4,8");
	}

	@Test
	void criaAlertaTarefaENotificacaoQuandoSlaVence() {
		var processo = cobranca(data(2026, 7, 27, 8), 10);
		when(notificacao.notificar(processo, 1)).thenReturn(true);

		service.verificar(processo, data(2026, 7, 28, 9));

		assertThat(processo.getSlaAlertadoEm()).isNotNull();
		assertThat(processo.getSlaEscalonamentoNivel()).isEqualTo(1);
		assertThat(processo.getPrioridade()).isEqualTo(Cobranca.Prioridade.ALTA);
		assertThat(processo.getSlaUltimaNotificacaoEm()).isNotNull();
		verify(timelineRepository).save(argThat(t -> "SLA_VENCIDO".equals(t.getEvento())));
		verify(tarefaRepository).save(argThat(t -> "TRATAR_SLA_VENCIDO".equals(t.getTipo())));
		verify(notificacao).notificar(processo, 1);
	}

	@Test
	void escalonaSemDuplicarTarefa() {
		var processo = cobranca(data(2026, 7, 27, 8), 10);
		processo.setSlaAlertadoEm(data(2026, 7, 28, 8));
		processo.setSlaEscalonamentoNivel(1);

		service.verificar(processo, data(2026, 7, 28, 13));

		assertThat(processo.getSlaEscalonamentoNivel()).isEqualTo(2);
		assertThat(processo.getPrioridade()).isEqualTo(Cobranca.Prioridade.CRITICA);
		verify(tarefaRepository, never()).save(any());
		verify(timelineRepository).save(argThat(t -> "SLA_ESCALONADO".equals(t.getEvento())));
		verify(notificacao).notificar(processo, 2);
	}

	@Test
	void ignoraEnquantoSlaEstaPausado() {
		var processo = cobranca(data(2026, 7, 27, 8), 1);
		processo.setSlaPausadoEm(data(2026, 7, 27, 9));

		service.verificar(processo, data(2026, 7, 29, 12));

		verifyNoInteractions(timelineRepository, tarefaRepository, notificacao);
	}

	private Cobranca cobranca(OffsetDateTime ultima, int horas) {
		var processo = new Cobranca();
		processo.setReferencia("COB-1");
		processo.setUltimaMovimentacaoEm(ultima);
		processo.setSlaHoras(horas);
		processo.setResponsavelNome("Fila");
		processo.setResponsavelIdentificador("FILA");
		return processo;
	}

	private OffsetDateTime data(int ano, int mes, int dia, int hora) {
		return ZonedDateTime.of(ano, mes, dia, hora, 0, 0, 0,
				ZoneId.of("America/Sao_Paulo")).toOffsetDateTime();
	}
}
