package br.com.w4solution.cob4.services.cobranca;

import br.com.w4solution.cob4.domain.*;
import br.com.w4solution.cob4.repositories.*;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;

@Service
public class SlaProcessoService {
	private final CobrancaRepository cobrancaRepository;
	private final ProcessoTimelineRepository timelineRepository;
	private final TarefaCobrancaRepository tarefaRepository;

	public SlaProcessoService(CobrancaRepository cobrancaRepository,
							 ProcessoTimelineRepository timelineRepository,
							 TarefaCobrancaRepository tarefaRepository) {
		this.cobrancaRepository = cobrancaRepository;
		this.timelineRepository = timelineRepository;
		this.tarefaRepository = tarefaRepository;
	}

	@Scheduled(
			fixedDelayString = "${sgc.cobranca.sla-verificacao-ms:60000}",
			initialDelayString = "${sgc.cobranca.sla-verificacao-inicial-ms:60000}")
	@Transactional
	public void verificar() {
		OffsetDateTime agora = OffsetDateTime.now();
		for (Cobranca processo : cobrancaRepository.findByStatusOrderByAtualizadaEmDesc(Cobranca.Status.ABERTA)) {
			if (processo.getUltimaMovimentacaoEm() == null
					|| !processo.getUltimaMovimentacaoEm().plusHours(processo.getSlaHoras()).isBefore(agora)
					|| processo.getSlaAlertadoEm() != null) {
				continue;
			}
			processo.setSlaAlertadoEm(agora);
			processo.setPrioridade(Cobranca.Prioridade.CRITICA);
			processo.setAtualizadaEm(agora);

			ProcessoTimeline timeline = new ProcessoTimeline();
			timeline.setCobranca(processo);
			timeline.setEvento("SLA_VENCIDO");
			timeline.setDescricao("Processo sem movimentação além do SLA configurado");
			timeline.setAutorNome("Monitor de SLA");
			timeline.setAutorIdentificador("SISTEMA_SLA");
			timeline.setCriadoEm(agora);
			timelineRepository.save(timeline);

			TarefaCobranca tarefa = new TarefaCobranca();
			tarefa.setCobranca(processo);
			tarefa.setTipo("TRATAR_SLA_VENCIDO");
			tarefa.setTitulo("Tratar processo com SLA vencido");
			tarefa.setPrioridade(Cobranca.Prioridade.CRITICA);
			tarefa.setResponsavelNome(processo.getResponsavelNome());
			tarefa.setResponsavelIdentificador(processo.getResponsavelIdentificador());
			tarefa.setPrazoEm(agora);
			tarefa.setCriadaEm(agora);
			tarefaRepository.save(tarefa);
		}
	}
}
