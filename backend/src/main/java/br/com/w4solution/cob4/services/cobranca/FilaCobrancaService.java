package br.com.w4solution.cob4.services.cobranca;

import br.com.w4solution.cob4.domain.Cobranca;
import br.com.w4solution.cob4.domain.ProcessoTimeline;
import br.com.w4solution.cob4.domain.TarefaCobranca;
import br.com.w4solution.cob4.dto.cobranca.*;
import br.com.w4solution.cob4.repositories.CobrancaRepository;
import br.com.w4solution.cob4.repositories.ProcessoTimelineRepository;
import br.com.w4solution.cob4.repositories.TarefaCobrancaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class FilaCobrancaService {
	private static final List<Cobranca.Status> ATIVOS = List.of(Cobranca.Status.ABERTA, Cobranca.Status.EM_ANDAMENTO);
	private final CobrancaRepository cobrancaRepository;
	private final TarefaCobrancaRepository tarefaRepository;
	private final ProcessoTimelineRepository timelineRepository;

	public FilaCobrancaService(CobrancaRepository cobrancaRepository,
							   TarefaCobrancaRepository tarefaRepository,
							   ProcessoTimelineRepository timelineRepository) {
		this.cobrancaRepository = cobrancaRepository;
		this.tarefaRepository = tarefaRepository;
		this.timelineRepository = timelineRepository;
	}

	@Transactional(readOnly = true)
	public List<TarefaCobrancaDTO> tarefas(String responsavelIdentificador) {
		var statuses = List.of(TarefaCobranca.Status.PENDENTE, TarefaCobranca.Status.EM_ANDAMENTO);
		var tarefas = responsavelIdentificador == null || responsavelIdentificador.isBlank()
				? tarefaRepository.findByStatusInOrderByPrazoEmAsc(statuses)
				: tarefaRepository.findByResponsavelIdentificadorAndStatusInOrderByPrazoEmAsc(
						responsavelIdentificador.trim(), statuses);
		return tarefas.stream().map(this::dto).toList();
	}

	@Transactional
	public TarefaCobrancaDTO atualizarTarefa(Long id, AtualizarTarefaDTO dados) {
		TarefaCobranca tarefa = tarefaRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Tarefa nao encontrada"));
		tarefa.setStatus(dados.status());
		return dto(tarefaRepository.save(tarefa));
	}

	@Transactional(readOnly = true)
	public List<CobrancaResumoDTO> minhaFila(String responsavelIdentificador) {
		return cobrancaRepository.findByResponsavelIdentificadorAndStatusInOrderByPrioridadeDescAtualizadaEmAsc(
				responsavelIdentificador, ATIVOS).stream().map(this::resumo).toList();
	}

	@Transactional
	public ResultadoDistribuicaoDTO distribuir(DistribuicaoCarteiraDTO dados) {
		List<OperadorDistribuicaoDTO> operadores = dados.operadores().stream()
				.filter(OperadorDistribuicaoDTO::online).toList();
		if (operadores.isEmpty()) {
			throw new IllegalArgumentException("Informe ao menos um operador online");
		}
		List<Cobranca> pendentes = cobrancaRepository
				.findByStatusInAndResponsavelIdentificadorOrderByPrioridadeDescAtualizadaEmAsc(ATIVOS, "FILA_COBRANCA");
		Map<String, Long> carga = operadores.stream().collect(Collectors.toMap(
				OperadorDistribuicaoDTO::identificador,
				o -> (long) cobrancaRepository.findByResponsavelIdentificadorAndStatusInOrderByPrioridadeDescAtualizadaEmAsc(
						o.identificador(), ATIVOS).size(),
				(a, b) -> a, LinkedHashMap::new));
		List<ResultadoDistribuicaoDTO.ItemDTO> itens = new ArrayList<>();
		OffsetDateTime agora = OffsetDateTime.now();
		for (Cobranca processo : pendentes) {
			OperadorDistribuicaoDTO operador = escolherOperador(operadores, carga, processo);
			processo.setResponsavelNome(operador.nome().trim());
			processo.setResponsavelIdentificador(operador.identificador().trim());
			processo.setAtualizadaEm(agora);
			carga.compute(operador.identificador(), (k, v) -> v == null ? 1L : v + 1);
			itens.add(new ResultadoDistribuicaoDTO.ItemDTO(
					processo.getReferencia(), operador.nome(), operador.identificador()));
			timeline(processo, "PROCESSO_DISTRIBUIDO",
					"Distribuido para " + operador.nome()
							+ (dados.motivo() == null || dados.motivo().isBlank() ? "" : ". Motivo: " + dados.motivo().trim()),
					dados.supervisorNome(), dados.supervisorIdentificador(), agora);
			for (TarefaCobranca tarefa : tarefaRepository.findByStatusInOrderByPrazoEmAsc(
					List.of(TarefaCobranca.Status.PENDENTE, TarefaCobranca.Status.EM_ANDAMENTO))) {
				if (tarefa.getCobranca().getId().equals(processo.getId())) {
					tarefa.setResponsavelNome(operador.nome().trim());
					tarefa.setResponsavelIdentificador(operador.identificador().trim());
				}
			}
		}
		cobrancaRepository.saveAll(pendentes);
		return new ResultadoDistribuicaoDTO(itens.size(), itens);
	}

	private OperadorDistribuicaoDTO escolherOperador(List<OperadorDistribuicaoDTO> operadores,
													 Map<String, Long> carga, Cobranca processo) {
		return operadores.stream()
				.filter(o -> cobrancaRepository.findByResponsavelIdentificadorAndStatusInOrderByPrioridadeDescAtualizadaEmAsc(
						o.identificador(), ATIVOS).stream()
						.anyMatch(c -> c.getCpfAgregador().equals(processo.getCpfAgregador())))
				.findFirst()
				.orElseGet(() -> operadores.stream()
						.min(Comparator.comparingLong(o -> carga.getOrDefault(o.identificador(), 0L)))
						.orElseThrow());
	}

	private TarefaCobrancaDTO dto(TarefaCobranca tarefa) {
		return new TarefaCobrancaDTO(tarefa.getId(), tarefa.getCobranca().getReferencia(),
				tarefa.getCobranca().getCliente().getNomeCompleto(), tarefa.getTipo(), tarefa.getTitulo(),
				tarefa.getStatus().name(), tarefa.getPrioridade().name(), tarefa.getResponsavelNome(),
				tarefa.getResponsavelIdentificador(), tarefa.getPrazoEm(), tarefa.getCriadaEm());
	}

	private CobrancaResumoDTO resumo(Cobranca cobranca) {
		return new CobrancaResumoDTO(cobranca.getReferencia(), cobranca.getCpfAgregador(),
				cobranca.getCliente().getNomeCompleto(), cobranca.getCliente().getTelefone(),
				cobranca.getCliente().getEmail(), cobranca.getValorTotal(), 0L, cobranca.getAtualizadaEm(),
				cobranca.getStatus().name(), cobranca.getContratoReferencia(), cobranca.getCliente().getRbxCodigo(),
				cobranca.getPrioridade().name(), cobranca.getSlaHoras(), cobranca.getResponsavelNome(),
				cobranca.getEstadoFluxo(), cobranca.getEstadoFluxoDesde(), cobranca.getDiasAtraso(),
				cobranca.getFaixaAtraso().name());
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
}
