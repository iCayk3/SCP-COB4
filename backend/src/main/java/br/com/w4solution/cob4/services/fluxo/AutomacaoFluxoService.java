package br.com.w4solution.cob4.services.fluxo;

import br.com.w4solution.cob4.domain.AtendimentoMensagem;
import br.com.w4solution.cob4.domain.ProcessoTimeline;
import br.com.w4solution.cob4.domain.TarefaCobranca;
import br.com.w4solution.cob4.repositories.AtendimentoMensagemRepository;
import br.com.w4solution.cob4.repositories.CobrancaRepository;
import br.com.w4solution.cob4.repositories.ProcessoTimelineRepository;
import br.com.w4solution.cob4.repositories.TarefaCobrancaRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;

@Service
public class AutomacaoFluxoService {
	private final CobrancaRepository cobrancaRepository;
	private final AtendimentoMensagemRepository mensagemRepository;
	private final TarefaCobrancaRepository tarefaRepository;
	private final ProcessoTimelineRepository timelineRepository;

	@Value("${sgc.cobranca.ligacao-sem-resposta-dias:7}")
	private int diasParaLigacao;

	public AutomacaoFluxoService(CobrancaRepository cobrancaRepository,
								 AtendimentoMensagemRepository mensagemRepository,
								 TarefaCobrancaRepository tarefaRepository,
								 ProcessoTimelineRepository timelineRepository) {
		this.cobrancaRepository = cobrancaRepository;
		this.mensagemRepository = mensagemRepository;
		this.tarefaRepository = tarefaRepository;
		this.timelineRepository = timelineRepository;
	}

	@Scheduled(fixedDelayString = "${sgc.fluxo.verificacao-ms:300000}",
			initialDelayString = "${sgc.fluxo.verificacao-inicial-ms:60000}")
	@Transactional
	public void agendarLigacaoSemResposta() {
		OffsetDateTime limite = OffsetDateTime.now().minusDays(diasParaLigacao);
		for (var processo : cobrancaRepository.findByEstadoFluxoAndEstadoFluxoDesdeBefore("NOVO", limite)) {
			boolean whatsappEnviado = mensagemRepository.existsByAtendimentoCobrancaIdAndAutor(
					processo.getId(), AtendimentoMensagem.Autor.OPERADOR);
			boolean respondeu = mensagemRepository.existsByAtendimentoCobrancaIdAndAutor(
					processo.getId(), AtendimentoMensagem.Autor.CLIENTE);
			if (!whatsappEnviado || respondeu || tarefaRepository.existsByCobrancaAndTipo(processo, "LIGACAO_SEM_RESPOSTA")) {
				continue;
			}

			TarefaCobranca tarefa = new TarefaCobranca();
			tarefa.setCobranca(processo);
			tarefa.setTipo("LIGACAO_SEM_RESPOSTA");
			tarefa.setTitulo("Realizar tentativa única por ligação");
			tarefa.setPrioridade(processo.getPrioridade());
			tarefa.setResponsavelNome(processo.getResponsavelNome());
			tarefa.setResponsavelIdentificador(processo.getResponsavelIdentificador());
			tarefa.setCriadaEm(OffsetDateTime.now());
			tarefa.setPrazoEm(OffsetDateTime.now());
			tarefaRepository.save(tarefa);

			ProcessoTimeline evento = new ProcessoTimeline();
			evento.setCobranca(processo);
			evento.setEvento("LIGACAO_AGENDADA");
			evento.setDescricao("Ligação agendada após " + diasParaLigacao + " dias sem resposta ao WhatsApp.");
			evento.setAutorNome("Automação SGC");
			evento.setAutorIdentificador("AUTOMACAO_SGC");
			evento.setCriadoEm(OffsetDateTime.now());
			timelineRepository.save(evento);
		}
	}
}
