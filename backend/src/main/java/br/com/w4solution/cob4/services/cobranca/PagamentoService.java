package br.com.w4solution.cob4.services.cobranca;

import br.com.w4solution.cob4.domain.*;
import br.com.w4solution.cob4.dto.cobranca.RegistrarPagamentoDTO;
import br.com.w4solution.cob4.repositories.*;
import br.com.w4solution.cob4.security.AcaoSistema;
import br.com.w4solution.cob4.security.AutorizacaoService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

@Service
public class PagamentoService {
	private final CobrancaRepository cobrancaRepository;
	private final HistoricoAtrasoRepository historicoRepository;
	private final PromessaPagamentoRepository promessaRepository;
	private final ProcessoTimelineRepository timelineRepository;
	private final TarefaCobrancaRepository tarefaRepository;
	private final AutorizacaoService autorizacaoService;

	public PagamentoService(CobrancaRepository cobrancaRepository, HistoricoAtrasoRepository historicoRepository,
			PromessaPagamentoRepository promessaRepository, ProcessoTimelineRepository timelineRepository,
			TarefaCobrancaRepository tarefaRepository, AutorizacaoService autorizacaoService) {
		this.cobrancaRepository = cobrancaRepository;
		this.historicoRepository = historicoRepository;
		this.promessaRepository = promessaRepository;
		this.timelineRepository = timelineRepository;
		this.tarefaRepository = tarefaRepository;
		this.autorizacaoService = autorizacaoService;
	}

	@Transactional
	public void registrarPagamento(String referencia, RegistrarPagamentoDTO dados) {
		autorizacaoService.exigir(dados.perfil(), AcaoSistema.CONFIRMAR_PAGAMENTO);
		Cobranca cobranca = cobranca(referencia);
		OffsetDateTime agora = OffsetDateTime.now();
		BigDecimal pago = dados.valor();
		if (dados.boletoReferencia() != null && !dados.boletoReferencia().isBlank()) {
			var historico = historicoRepository.findByBoletoReferencia(dados.boletoReferencia().trim())
					.orElseThrow(() -> new IllegalArgumentException("Boleto nao encontrado no historico"));
			historico.setDataPagamento(dados.dataPagamento());
			historico.setSituacao("PAGO");
			historicoRepository.save(historico);
		} else {
			for (HistoricoAtraso historico : historicoRepository.findByContratoReferenciaAndCpfAndDataPagamentoIsNull(
					cobranca.getContratoReferencia(), cobranca.getCpfAgregador())) {
				historico.setDataPagamento(dados.dataPagamento());
				historico.setSituacao("PAGO");
				historicoRepository.save(historico);
			}
		}
		BigDecimal saldo = cobranca.getValorTotal().subtract(pago).max(BigDecimal.ZERO);
		cobranca.setValorTotal(saldo);
		cobranca.setUltimaMovimentacaoEm(agora);
		cobranca.setAtualizadaEm(agora);
		if (saldo.signum() == 0) {
			cobranca.autorizarReabertura();
			cobranca.setStatus(Cobranca.Status.PAGA);
			cobranca.setEstadoFluxo("ENCERRADO");
			cobranca.setEstadoFluxoDesde(agora);
			cobranca.setEncerradaEm(agora);
			cobranca.setMotivoEncerramento("Pagamento integral confirmado");
			cobranca.setMotivoEncerramentoCodigo("PAGAMENTO_INTEGRAL");
			cobranca.setMotivoEncerramentoNome("Pagamento integral confirmado");
			cobranca.setObservacaoEncerramento(limpar(dados.observacao()));
			concluirTarefas(cobranca);
			cumprirPromessas(cobranca, agora);
		} else {
			cobranca.setStatus(Cobranca.Status.EM_ANDAMENTO);
			cobranca.setEstadoFluxo("AGUARDANDO");
			cobranca.setEstadoFluxoDesde(agora);
		}
		cobrancaRepository.save(cobranca);
		timeline(cobranca, "PAGAMENTO_CONFIRMADO",
				"Pagamento confirmado no valor de " + pago + ". Saldo atual: " + saldo
						+ (dados.comprovanteReferencia() == null || dados.comprovanteReferencia().isBlank()
						? "" : ". Comprovante: " + dados.comprovanteReferencia().trim()),
				dados.usuarioNome(), dados.usuarioIdentificador(), agora);
	}

	@Transactional
	public void registrarEstorno(String referencia, RegistrarPagamentoDTO dados) {
		autorizacaoService.exigir(dados.perfil(), AcaoSistema.CONFIRMAR_PAGAMENTO);
		Cobranca cobranca = cobranca(referencia);
		OffsetDateTime agora = OffsetDateTime.now();
		cobranca.autorizarReabertura();
		cobranca.setStatus(Cobranca.Status.EM_ANDAMENTO);
		cobranca.setEstadoFluxo("EM_ATENDIMENTO");
		cobranca.setEstadoFluxoDesde(agora);
		cobranca.setValorTotal(cobranca.getValorTotal().add(dados.valor()));
		cobranca.setEncerradaEm(null);
		cobranca.setMotivoEncerramento(null);
		cobranca.setMotivoEncerramentoCodigo(null);
		cobranca.setMotivoEncerramentoNome(null);
		cobranca.setObservacaoEncerramento(null);
		cobranca.setUltimaMovimentacaoEm(agora);
		cobranca.setAtualizadaEm(agora);
		cobrancaRepository.save(cobranca);
		TarefaCobranca tarefa = new TarefaCobranca();
		tarefa.setCobranca(cobranca);
		tarefa.setTipo("TRATAR_ESTORNO");
		tarefa.setTitulo("Tratar estorno financeiro");
		tarefa.setPrioridade(Cobranca.Prioridade.CRITICA);
		tarefa.setResponsavelNome(cobranca.getResponsavelNome());
		tarefa.setResponsavelIdentificador(cobranca.getResponsavelIdentificador());
		tarefa.setCriadaEm(agora);
		tarefa.setPrazoEm(agora);
		tarefaRepository.save(tarefa);
		timeline(cobranca, "PAGAMENTO_ESTORNADO",
				"Estorno registrado no valor de " + dados.valor() + ". Protocolo reaberto.",
				dados.usuarioNome(), dados.usuarioIdentificador(), agora);
	}

	private Cobranca cobranca(String referencia) {
		return cobrancaRepository.findByReferencia(referencia)
				.orElseThrow(() -> new IllegalArgumentException("Processo nao encontrado"));
	}

	private void cumprirPromessas(Cobranca cobranca, OffsetDateTime agora) {
		List<PromessaPagamento> promessas = promessaRepository.findByCobrancaInAndStatus(
				List.of(cobranca), PromessaPagamento.Status.ABERTA);
		for (PromessaPagamento promessa : promessas) {
			promessa.setStatus(PromessaPagamento.Status.CUMPRIDA);
			promessa.setAtualizadaEm(agora);
		}
		promessaRepository.saveAll(promessas);
	}

	private void concluirTarefas(Cobranca cobranca) {
		for (TarefaCobranca tarefa : tarefaRepository.findByStatusInOrderByPrazoEmAsc(
				List.of(TarefaCobranca.Status.PENDENTE, TarefaCobranca.Status.EM_ANDAMENTO))) {
			if (tarefa.getCobranca().getId().equals(cobranca.getId())) {
				tarefa.setStatus(TarefaCobranca.Status.CONCLUIDA);
			}
		}
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
