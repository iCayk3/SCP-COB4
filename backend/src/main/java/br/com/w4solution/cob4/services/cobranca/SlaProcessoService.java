package br.com.w4solution.cob4.services.cobranca;

import br.com.w4solution.cob4.domain.*;
import br.com.w4solution.cob4.repositories.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.OffsetDateTime;
import java.util.Arrays;
import java.util.List;

@Service
public class SlaProcessoService {
	private static final Logger log = LoggerFactory.getLogger(SlaProcessoService.class);
	private static final List<Cobranca.Status> STATUS_ATIVOS =
			List.of(Cobranca.Status.ABERTA, Cobranca.Status.EM_ANDAMENTO);

	private final CobrancaRepository cobrancaRepository;
	private final ProcessoTimelineRepository timelineRepository;
	private final TarefaCobrancaRepository tarefaRepository;
	private final CalendarioSlaService calendario;
	private final NotificacaoSlaService notificacao;
	private final long[] escalonamentosHoras;

	public SlaProcessoService(CobrancaRepository cobrancaRepository,
							 ProcessoTimelineRepository timelineRepository,
							 TarefaCobrancaRepository tarefaRepository,
							 CalendarioSlaService calendario,
							 NotificacaoSlaService notificacao,
							 @Value("${sgc.cobranca.sla.escalonamento-horas:0,4,8}") String escalonamentosHoras) {
		this.cobrancaRepository = cobrancaRepository;
		this.timelineRepository = timelineRepository;
		this.tarefaRepository = tarefaRepository;
		this.calendario = calendario;
		this.notificacao = notificacao;
		this.escalonamentosHoras = parseEscalonamentos(escalonamentosHoras);
	}

	@Scheduled(
			fixedDelayString = "${sgc.cobranca.sla-verificacao-ms:60000}",
			initialDelayString = "${sgc.cobranca.sla-verificacao-inicial-ms:60000}")
	@Transactional
	public void verificar() {
		OffsetDateTime agora = OffsetDateTime.now();
		for (Cobranca processo : cobrancaRepository.findByStatusInOrderByAtualizadaEmDesc(STATUS_ATIVOS)) {
			verificar(processo, agora);
		}
	}

	void verificar(Cobranca processo, OffsetDateTime agora) {
		if (processo.getUltimaMovimentacaoEm() == null || processo.getSlaPausadoEm() != null) return;
		OffsetDateTime vencimento = calendario.adicionarHorasUteis(
				processo.getUltimaMovimentacaoEm(), processo.getSlaHoras());
		vencimento = calendario.adicionarTempoUtil(vencimento, Duration.ofSeconds(processo.getSlaPausaSegundos()));
		int nivelDevido = nivelDevido(vencimento, agora);
		if (nivelDevido <= processo.getSlaEscalonamentoNivel()) return;

		if (processo.getSlaAlertadoEm() == null) {
			processo.setSlaAlertadoEm(agora);
			criarTarefa(processo, agora);
		}
		processo.setSlaEscalonamentoNivel(nivelDevido);
		processo.setPrioridade(nivelDevido >= 2 ? Cobranca.Prioridade.CRITICA : Cobranca.Prioridade.ALTA);
		processo.setAtualizadaEm(agora);
		registrarTimeline(processo, agora, nivelDevido, vencimento);
		try {
			if (notificacao.notificar(processo, nivelDevido)) processo.setSlaUltimaNotificacaoEm(agora);
		} catch (RuntimeException erro) {
			log.error("Falha ao enviar notificação de SLA do processo {}", processo.getReferencia(), erro);
		}
	}

	private int nivelDevido(OffsetDateTime vencimento, OffsetDateTime agora) {
		int nivel = 0;
		for (int i = 0; i < escalonamentosHoras.length; i++) {
			OffsetDateTime limite = calendario.adicionarHorasUteis(vencimento, escalonamentosHoras[i]);
			if (!agora.isBefore(limite)) nivel = i + 1;
		}
		return nivel;
	}

	private void criarTarefa(Cobranca processo, OffsetDateTime agora) {
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

	private void registrarTimeline(Cobranca processo, OffsetDateTime agora, int nivel, OffsetDateTime vencimento) {
		ProcessoTimeline timeline = new ProcessoTimeline();
		timeline.setCobranca(processo);
		timeline.setEvento(nivel == 1 ? "SLA_VENCIDO" : "SLA_ESCALONADO");
		timeline.setDescricao("SLA útil vencido em " + vencimento + "; escalonamento no nível " + nivel);
		timeline.setAutorNome("Monitor de SLA");
		timeline.setAutorIdentificador("SISTEMA_SLA");
		timeline.setCriadoEm(agora);
		timelineRepository.save(timeline);
	}

	private static long[] parseEscalonamentos(String valor) {
		long[] niveis = Arrays.stream(valor.split(",")).map(String::trim).filter(s -> !s.isEmpty())
				.mapToLong(Long::parseLong).sorted().distinct().toArray();
		if (niveis.length == 0 || niveis[0] != 0) throw new IllegalArgumentException(
				"O primeiro escalonamento de SLA deve ocorrer em 0 horas");
		return niveis;
	}
}
