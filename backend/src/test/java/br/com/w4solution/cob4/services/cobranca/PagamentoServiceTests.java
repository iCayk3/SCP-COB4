package br.com.w4solution.cob4.services.cobranca;

import br.com.w4solution.cob4.domain.Cobranca;
import br.com.w4solution.cob4.domain.ProcessoTimeline;
import br.com.w4solution.cob4.domain.TarefaCobranca;
import br.com.w4solution.cob4.dto.cobranca.RegistrarPagamentoDTO;
import br.com.w4solution.cob4.repositories.*;
import br.com.w4solution.cob4.security.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PagamentoServiceTests {
	@Mock CobrancaRepository cobrancaRepository;
	@Mock HistoricoAtrasoRepository historicoRepository;
	@Mock PromessaPagamentoRepository promessaRepository;
	@Mock ProcessoTimelineRepository timelineRepository;
	@Mock TarefaCobrancaRepository tarefaRepository;
	@Mock AutorizacaoService autorizacaoService;

	@Test
	void estornoReabreProtocoloCriaTarefaCriticaEAuditoria() {
		var cobranca = new Cobranca();
		cobranca.setId(10L);
		cobranca.setReferencia("COB-10");
		cobranca.setStatus(Cobranca.Status.PAGA);
		cobranca.setValorTotal(BigDecimal.ZERO);
		cobranca.setResponsavelNome("Financeiro");
		cobranca.setResponsavelIdentificador("fin-1");
		cobranca.setCriadaEm(OffsetDateTime.now().minusDays(1));
		cobranca.setAtualizadaEm(OffsetDateTime.now().minusDays(1));
		when(cobrancaRepository.findByReferencia("COB-10")).thenReturn(Optional.of(cobranca));
		when(autorizacaoService.exigir(AcaoSistema.CONFIRMAR_PAGAMENTO)).thenReturn(
				new UsuarioAutenticado(1L, "Financeiro", "fin-1", PerfilUsuario.FINANCEIRO));
		var service = new PagamentoService(cobrancaRepository, historicoRepository, promessaRepository,
				timelineRepository, tarefaRepository, autorizacaoService);

		service.registrarEstorno("COB-10", new RegistrarPagamentoDTO(
				new BigDecimal("75.00"), LocalDate.now(), null, null, "Estorno RBX"));

		assertThat(cobranca.getStatus()).isEqualTo(Cobranca.Status.EM_ANDAMENTO);
		assertThat(cobranca.getValorTotal()).isEqualByComparingTo("75.00");
		ArgumentCaptor<TarefaCobranca> tarefa = ArgumentCaptor.forClass(TarefaCobranca.class);
		verify(tarefaRepository).save(tarefa.capture());
		assertThat(tarefa.getValue().getTipo()).isEqualTo("TRATAR_ESTORNO");
		assertThat(tarefa.getValue().getPrioridade()).isEqualTo(Cobranca.Prioridade.CRITICA);
		ArgumentCaptor<ProcessoTimeline> timeline = ArgumentCaptor.forClass(ProcessoTimeline.class);
		verify(timelineRepository).save(timeline.capture());
		assertThat(timeline.getValue().getEvento()).isEqualTo("PAGAMENTO_ESTORNADO");
	}
}
