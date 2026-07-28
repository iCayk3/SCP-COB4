package br.com.w4solution.cob4.services.cobranca;

import br.com.w4solution.cob4.domain.*;
import br.com.w4solution.cob4.dto.cobranca.PromessaPagamentoDTO;
import br.com.w4solution.cob4.dto.cobranca.RegistrarPromessaDTO;
import br.com.w4solution.cob4.repositories.CobrancaRepository;
import br.com.w4solution.cob4.repositories.ProcessoTimelineRepository;
import br.com.w4solution.cob4.repositories.PromessaPagamentoRepository;
import br.com.w4solution.cob4.repositories.TarefaCobrancaRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;

@Service
public class PromessaPagamentoService {
	private final PromessaPagamentoRepository promessaRepository;
	private final CobrancaRepository cobrancaRepository;
	private final ProcessoTimelineRepository timelineRepository;
	private final TarefaCobrancaRepository tarefaRepository;

	public PromessaPagamentoService(PromessaPagamentoRepository promessaRepository,
			CobrancaRepository cobrancaRepository, ProcessoTimelineRepository timelineRepository,
			TarefaCobrancaRepository tarefaRepository) {
		this.promessaRepository = promessaRepository;
		this.cobrancaRepository = cobrancaRepository;
		this.timelineRepository = timelineRepository;
		this.tarefaRepository = tarefaRepository;
	}

	@Transactional(readOnly = true)
	public List<PromessaPagamentoDTO> listar(String referencia) {
		return promessaRepository.findByCobrancaReferenciaOrderByCriadaEmDesc(referencia).stream()
				.map(this::dto).toList();
	}

	@Transactional
	public PromessaPagamentoDTO registrar(String referencia, RegistrarPromessaDTO dados) {
		Cobranca cobranca = cobrancaRepository.findByReferencia(referencia)
				.orElseThrow(() -> new IllegalArgumentException("Processo nao encontrado"));
		if (cobranca.encerrada()) throw new IllegalStateException("Processo encerrado nao aceita promessa");
		OffsetDateTime agora = OffsetDateTime.now();
		PromessaPagamento promessa = new PromessaPagamento();
		promessa.setCobranca(cobranca);
		promessa.setValor(dados.valor());
		promessa.setVencimento(dados.vencimento());
		promessa.setOperadorNome(dados.operadorNome().trim());
		promessa.setOperadorIdentificador(dados.operadorIdentificador().trim());
		promessa.setObservacao(limpar(dados.observacao()));
		promessa.setCriadaEm(agora);
		promessa.setAtualizadaEm(agora);
		cobranca.setEstadoFluxo("AGUARDANDO");
		cobranca.setEstadoFluxoDesde(agora);
		cobranca.setUltimaMovimentacaoEm(agora);
		cobranca.setAtualizadaEm(agora);
		cobrancaRepository.save(cobranca);
		PromessaPagamento salva = promessaRepository.save(promessa);
		timeline(cobranca, "PROMESSA_REGISTRADA",
				"Promessa registrada no valor de " + dados.valor() + " para " + dados.vencimento(),
				dados.operadorNome(), dados.operadorIdentificador(), agora);
		return dto(salva);
	}

	@Scheduled(fixedDelayString = "${sgc.promessas.verificacao-ms:3600000}",
			initialDelayString = "${sgc.promessas.verificacao-inicial-ms:120000}")
	@Transactional
	public void quebrarVencidas() {
		OffsetDateTime agora = OffsetDateTime.now();
		for (PromessaPagamento promessa : promessaRepository.findByStatusAndVencimentoBefore(
				PromessaPagamento.Status.ABERTA, LocalDate.now())) {
			promessa.setStatus(PromessaPagamento.Status.QUEBRADA);
			promessa.setAtualizadaEm(agora);
			Cobranca cobranca = promessa.getCobranca();
			if (!cobranca.encerrada()) {
				cobranca.setPrioridade(Cobranca.Prioridade.CRITICA);
				cobranca.setEstadoFluxo("EM_ATENDIMENTO");
				cobranca.setEstadoFluxoDesde(agora);
				cobranca.setUltimaMovimentacaoEm(agora);
				cobranca.setAtualizadaEm(agora);
				TarefaCobranca tarefa = new TarefaCobranca();
				tarefa.setCobranca(cobranca);
				tarefa.setTipo("PROMESSA_QUEBRADA");
				tarefa.setTitulo("Retomar contato apos promessa quebrada");
				tarefa.setPrioridade(Cobranca.Prioridade.CRITICA);
				tarefa.setResponsavelNome(cobranca.getResponsavelNome());
				tarefa.setResponsavelIdentificador(cobranca.getResponsavelIdentificador());
				tarefa.setCriadaEm(agora);
				tarefa.setPrazoEm(agora);
				tarefaRepository.save(tarefa);
				timeline(cobranca, "PROMESSA_QUEBRADA",
						"Promessa vencida em " + promessa.getVencimento() + " sem pagamento confirmado",
						"Automacao SGC", "AUTOMACAO_SGC", agora);
			}
		}
	}

	private PromessaPagamentoDTO dto(PromessaPagamento p) {
		return new PromessaPagamentoDTO(p.getId(), p.getCobranca().getReferencia(), p.getValor(),
				p.getVencimento(), p.getStatus().name(), p.getOperadorNome(), p.getOperadorIdentificador(),
				p.getObservacao(), p.getCriadaEm(), p.getAtualizadaEm());
	}

	private void timeline(Cobranca cobranca, String evento, String descricao, String autor, String autorId,
						  OffsetDateTime criadoEm) {
		ProcessoTimeline timeline = new ProcessoTimeline();
		timeline.setCobranca(cobranca);
		timeline.setEvento(evento);
		timeline.setDescricao(descricao);
		timeline.setAutorNome(autor);
		timeline.setAutorIdentificador(autorId);
		timeline.setCriadoEm(criadoEm);
		timelineRepository.save(timeline);
	}

	private String limpar(String valor) {
		return valor == null || valor.isBlank() ? null : valor.trim();
	}
}
