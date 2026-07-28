package br.com.w4solution.cob4.services.cobranca;

import br.com.w4solution.cob4.domain.Cobranca;
import br.com.w4solution.cob4.repositories.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.OffsetDateTime;
import java.util.List;
import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SlaProcessoServiceTests {
	@Mock CobrancaRepository cobrancaRepository;
	@Mock ProcessoTimelineRepository timelineRepository;
	@Mock TarefaCobrancaRepository tarefaRepository;

	@Test void criaAlertaETarefaQuandoSlaVence() {
		var c = cobranca(OffsetDateTime.now().minusHours(25));
		when(cobrancaRepository.findByStatusOrderByAtualizadaEmDesc(Cobranca.Status.ABERTA)).thenReturn(List.of(c));
		new SlaProcessoService(cobrancaRepository, timelineRepository, tarefaRepository).verificar();
		assertThat(c.getSlaAlertadoEm()).isNotNull();
		assertThat(c.getPrioridade()).isEqualTo(Cobranca.Prioridade.CRITICA);
		verify(timelineRepository).save(argThat(t -> "SLA_VENCIDO".equals(t.getEvento())));
		verify(tarefaRepository).save(argThat(t -> "TRATAR_SLA_VENCIDO".equals(t.getTipo())));
	}
	@Test void naoDuplicaAlertaJaEmitido() {
		var c = cobranca(OffsetDateTime.now().minusHours(25)); c.setSlaAlertadoEm(OffsetDateTime.now());
		when(cobrancaRepository.findByStatusOrderByAtualizadaEmDesc(Cobranca.Status.ABERTA)).thenReturn(List.of(c));
		new SlaProcessoService(cobrancaRepository, timelineRepository, tarefaRepository).verificar();
		verifyNoInteractions(timelineRepository, tarefaRepository);
	}
	private Cobranca cobranca(OffsetDateTime ultima) {
		var c = new Cobranca(); c.setUltimaMovimentacaoEm(ultima); c.setSlaHoras(24);
		c.setResponsavelNome("Fila"); c.setResponsavelIdentificador("FILA"); return c;
	}
}
