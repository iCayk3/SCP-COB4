package br.com.w4solution.cob4.services.cobranca;

import br.com.w4solution.cob4.domain.Cobranca;
import br.com.w4solution.cob4.domain.ProcessoTimeline;
import br.com.w4solution.cob4.domain.TarefaCobranca;
import br.com.w4solution.cob4.domain.Usuario;
import br.com.w4solution.cob4.dto.cobranca.*;
import br.com.w4solution.cob4.repositories.CobrancaRepository;
import br.com.w4solution.cob4.repositories.ProcessoTimelineRepository;
import br.com.w4solution.cob4.repositories.TarefaCobrancaRepository;
import br.com.w4solution.cob4.repositories.UsuarioRepository;
import br.com.w4solution.cob4.security.AcaoSistema;
import br.com.w4solution.cob4.security.AutorizacaoService;
import br.com.w4solution.cob4.security.PerfilUsuario;
import br.com.w4solution.cob4.dto.api.PaginaDTO;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
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
	private final UsuarioRepository usuarioRepository;
	private final AutorizacaoService autorizacaoService;

	public FilaCobrancaService(CobrancaRepository cobrancaRepository,
							   TarefaCobrancaRepository tarefaRepository,
							   ProcessoTimelineRepository timelineRepository,
							   UsuarioRepository usuarioRepository,
							   AutorizacaoService autorizacaoService) {
		this.cobrancaRepository = cobrancaRepository;
		this.tarefaRepository = tarefaRepository;
		this.timelineRepository = timelineRepository;
		this.usuarioRepository = usuarioRepository;
		this.autorizacaoService = autorizacaoService;
	}

	@Transactional(readOnly = true)
	public List<TarefaCobrancaDTO> tarefas(String responsavelIdentificador) {
		var usuario = autorizacaoService.atual();
		if (usuario.perfil() == PerfilUsuario.OPERADOR) {
			responsavelIdentificador = usuario.identificador();
		}
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
		var usuario = autorizacaoService.atual();
		if (usuario.perfil() == PerfilUsuario.OPERADOR
				&& !usuario.identificador().equalsIgnoreCase(tarefa.getResponsavelIdentificador())) {
			throw new org.springframework.security.access.AccessDeniedException(
					"Operador nao pode alterar tarefa de outra carteira");
		}
		tarefa.setStatus(dados.status());
		return dto(tarefaRepository.save(tarefa));
	}

	@Transactional(readOnly = true)
	public List<CobrancaResumoDTO> minhaFila(String responsavelIdentificador) {
		var usuario = autorizacaoService.atual();
		if (usuario.perfil() == PerfilUsuario.OPERADOR) {
			responsavelIdentificador = usuario.identificador();
		}
		return cobrancaRepository.findByResponsavelIdentificadorAndStatusInOrderByPrioridadeDescAtualizadaEmAsc(
				responsavelIdentificador, ATIVOS).stream().map(this::resumo).toList();
	}

	@Transactional
	public ResultadoDistribuicaoDTO distribuir(DistribuicaoCarteiraDTO dados) {
		var supervisor = autorizacaoService.exigir(AcaoSistema.DISTRIBUIR_CARTEIRA);
		Set<String> filtro = dados.operadorIdentificadores() == null ? Set.of()
				: dados.operadorIdentificadores().stream().filter(Objects::nonNull)
						.map(String::trim).map(String::toLowerCase).collect(Collectors.toSet());
		List<Usuario> operadores = usuarioRepository
				.findByPerfilAndAtivoTrueAndPresenteTrueOrderByIdentificador(PerfilUsuario.OPERADOR).stream()
				.filter(o -> filtro.isEmpty() || filtro.contains(o.getIdentificador().toLowerCase()))
				.toList();
		if (operadores.isEmpty()) {
			throw new IllegalArgumentException("Nao ha operador ativo e presente para distribuicao");
		}
		List<Cobranca> pendentes = cobrancaRepository
				.findByStatusInAndResponsavelIdentificadorOrderByPrioridadeDescAtualizadaEmAsc(ATIVOS, "FILA_COBRANCA");
		Map<String, Long> carga = operadores.stream().collect(Collectors.toMap(
				Usuario::getIdentificador,
				o -> (long) cobrancaRepository.findByResponsavelIdentificadorAndStatusInOrderByPrioridadeDescAtualizadaEmAsc(
						o.getIdentificador(), ATIVOS).size(),
				(a, b) -> a, LinkedHashMap::new));
		List<ResultadoDistribuicaoDTO.ItemDTO> itens = new ArrayList<>();
		OffsetDateTime agora = OffsetDateTime.now();
		for (Cobranca processo : pendentes) {
			Usuario operador = escolherOperador(operadores, carga, processo);
			if (operador == null) break;
			processo.setResponsavelNome(operador.getNome());
			processo.setResponsavelIdentificador(operador.getIdentificador());
			processo.setAtualizadaEm(agora);
			carga.compute(operador.getIdentificador(), (k, v) -> v == null ? 1L : v + 1);
			itens.add(new ResultadoDistribuicaoDTO.ItemDTO(
					processo.getReferencia(), operador.getNome(), operador.getIdentificador()));
			timeline(processo, "PROCESSO_DISTRIBUIDO",
					"Distribuido para " + operador.getNome()
							+ (dados.motivo() == null || dados.motivo().isBlank() ? "" : ". Motivo: " + dados.motivo().trim()),
					supervisor.nome(), supervisor.identificador(), agora);
			atualizarTarefas(processo, operador);
		}
		cobrancaRepository.saveAll(pendentes);
		return new ResultadoDistribuicaoDTO(itens.size(), itens);
	}

	@Transactional
	public ResultadoDistribuicaoDTO.ItemDTO redistribuir(String referencia, RedistribuirCarteiraDTO dados) {
		var supervisor = autorizacaoService.exigir(AcaoSistema.DISTRIBUIR_CARTEIRA);
		Cobranca processo = cobrancaRepository.findByReferencia(referencia)
				.orElseThrow(() -> new IllegalArgumentException("Processo nao encontrado"));
		Usuario operador = usuarioRepository.findByIdentificadorIgnoreCase(dados.operadorIdentificador().trim())
				.filter(u -> u.getPerfil() == PerfilUsuario.OPERADOR && u.isAtivo() && u.isPresente())
				.orElseThrow(() -> new IllegalArgumentException("Operador deve estar ativo e presente"));
		long carga = cobrancaRepository.findByResponsavelIdentificadorAndStatusInOrderByPrioridadeDescAtualizadaEmAsc(
				operador.getIdentificador(), ATIVOS).size();
		if (carga >= operador.getCargaMaxima()) {
			throw new IllegalStateException("Operador atingiu a carga maxima");
		}
		String anterior = processo.getResponsavelNome() + " (" + processo.getResponsavelIdentificador() + ")";
		processo.setResponsavelNome(operador.getNome());
		processo.setResponsavelIdentificador(operador.getIdentificador());
		processo.setAtualizadaEm(OffsetDateTime.now());
		cobrancaRepository.save(processo);
		atualizarTarefas(processo, operador);
		timeline(processo, "PROCESSO_REDISTRIBUIDO",
				"Redistribuido de " + anterior + " para " + operador.getNome() + ". Motivo: " + dados.motivo().trim(),
				supervisor.nome(), supervisor.identificador(), OffsetDateTime.now());
		return new ResultadoDistribuicaoDTO.ItemDTO(referencia, operador.getNome(), operador.getIdentificador());
	}

	@Transactional(readOnly = true)
	public PaginaDTO<CobrancaResumoDTO> minhaFilaPaginada(int pagina, int tamanho, String busca,
			Cobranca.Prioridade prioridade, String estado, Cobranca.FaixaAtraso faixa,
			Integer diasMin, Integer diasMax, String ordenarPor, String direcao) {
		if (pagina < 0) throw new IllegalArgumentException("Pagina deve ser maior ou igual a zero");
		if (tamanho < 1 || tamanho > 100) throw new IllegalArgumentException("Tamanho deve estar entre 1 e 100");
		if (diasMin != null && diasMax != null && diasMin > diasMax) throw new IllegalArgumentException("Faixa de dias invalida");
		Map<String, String> campos = Map.of("prioridade", "prioridade", "atualizacao", "atualizadaEm",
				"valor", "valorTotal", "atraso", "diasAtraso", "sla", "estadoFluxoDesde");
		String campo = campos.getOrDefault(ordenarPor == null ? "prioridade" : ordenarPor, "prioridade");
		Sort.Direction sentido = "asc".equalsIgnoreCase(direcao) ? Sort.Direction.ASC : Sort.Direction.DESC;
		var pageable = PageRequest.of(pagina, tamanho, Sort.by(sentido, campo).and(Sort.by(Sort.Direction.ASC, "atualizadaEm")));
		var usuario = autorizacaoService.atual();
		return PaginaDTO.de(cobrancaRepository.buscarFila(ATIVOS, usuario.identificador(), prioridade,
				estado == null || estado.isBlank() ? null : estado.trim(), faixa, diasMin, diasMax,
				busca == null ? "" : busca.trim(), pageable), this::resumo);
	}

	@Transactional(readOnly = true)
	public PaginaDTO<TarefaCobrancaDTO> minhasTarefasPaginadas(int pagina, int tamanho) {
		if (pagina < 0 || tamanho < 1 || tamanho > 100) throw new IllegalArgumentException("Paginacao invalida");
		var usuario = autorizacaoService.atual();
		var pageable = PageRequest.of(pagina, tamanho, Sort.by(Sort.Direction.ASC, "prazoEm"));
		return PaginaDTO.de(tarefaRepository.findByResponsavelIdentificadorAndStatusIn(usuario.identificador(),
				List.of(TarefaCobranca.Status.PENDENTE, TarefaCobranca.Status.EM_ANDAMENTO), pageable), this::dto);
	}

	private Usuario escolherOperador(List<Usuario> operadores, Map<String, Long> carga, Cobranca processo) {
		List<Usuario> disponiveis = operadores.stream()
				.filter(o -> carga.getOrDefault(o.getIdentificador(), 0L) < o.getCargaMaxima()).toList();
		return disponiveis.stream()
				.filter(o -> cobrancaRepository.findByResponsavelIdentificadorAndStatusInOrderByPrioridadeDescAtualizadaEmAsc(
						o.getIdentificador(), ATIVOS).stream()
						.anyMatch(c -> c.getCpfAgregador().equals(processo.getCpfAgregador())))
				.findFirst()
				.orElseGet(() -> disponiveis.stream()
						.min(Comparator.comparingLong(o -> carga.getOrDefault(o.getIdentificador(), 0L)))
						.orElse(null));
	}

	private void atualizarTarefas(Cobranca processo, Usuario operador) {
		for (TarefaCobranca tarefa : tarefaRepository.findByStatusInOrderByPrazoEmAsc(
				List.of(TarefaCobranca.Status.PENDENTE, TarefaCobranca.Status.EM_ANDAMENTO))) {
			if (tarefa.getCobranca().getId().equals(processo.getId())) {
				tarefa.setResponsavelNome(operador.getNome());
				tarefa.setResponsavelIdentificador(operador.getIdentificador());
			}
		}
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
				cobranca.getFaixaAtraso().name(), cobranca.getSlaPausadoEm(),
				cobranca.getSlaEscalonamentoNivel(), cobranca.getSlaAlertadoEm(),
				cobranca.getSlaUltimaNotificacaoEm());
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
