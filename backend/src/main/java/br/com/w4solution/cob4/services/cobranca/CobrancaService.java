package br.com.w4solution.cob4.services.cobranca;

import br.com.w4solution.cob4.domain.Cliente;
import br.com.w4solution.cob4.domain.Cobranca;
import br.com.w4solution.cob4.domain.CobrancaBoleto;
import br.com.w4solution.cob4.domain.HistoricoAtraso;
import br.com.w4solution.cob4.domain.LogAuditoria;
import br.com.w4solution.cob4.domain.ProcessoTimeline;
import br.com.w4solution.cob4.domain.TarefaCobranca;
import br.com.w4solution.cob4.dto.cliente.ClienteRbxDTO;
import br.com.w4solution.cob4.dto.cobranca.CobrancaResumoDTO;
import br.com.w4solution.cob4.dto.cobranca.ClienteProtocolosDTO;
import br.com.w4solution.cob4.dto.cobranca.PaginaCobrancaDTO;
import br.com.w4solution.cob4.dto.cobranca.SincronizacaoCobrancaDTO;
import br.com.w4solution.cob4.dto.rbx.BoletosAbertos;
import br.com.w4solution.cob4.repositories.ClienteRepository;
import br.com.w4solution.cob4.repositories.CobrancaBoletoRepository;
import br.com.w4solution.cob4.repositories.CobrancaRepository;
import br.com.w4solution.cob4.repositories.HistoricoAtrasoRepository;
import br.com.w4solution.cob4.repositories.LogAuditoriaRepository;
import br.com.w4solution.cob4.repositories.ProcessoTimelineRepository;
import br.com.w4solution.cob4.repositories.TarefaCobrancaRepository;
import br.com.w4solution.cob4.services.rbx.ServiceRbx;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class CobrancaService {
	private static final List<DateTimeFormatter> FORMATOS_DATA = List.of(
			DateTimeFormatter.ISO_LOCAL_DATE,
			DateTimeFormatter.ofPattern("dd/MM/yyyy"),
			DateTimeFormatter.ofPattern("dd-MM-yyyy")
	);

	private final ServiceRbx serviceRbx;
	private final ClienteRepository clienteRepository;
	private final CobrancaRepository cobrancaRepository;
	private final CobrancaBoletoRepository boletoRepository;
	private final HistoricoAtrasoRepository historicoRepository;
	private final LogAuditoriaRepository logRepository;
	private final ProcessoTimelineRepository timelineRepository;
	private final TarefaCobrancaRepository tarefaRepository;
	private final FaixaAtrasoConfigService faixaAtrasoService;

	@Value("${sgc.cobranca.responsavel-padrao.nome:Fila de Cobrança}")
	private String responsavelPadraoNome;
	@Value("${sgc.cobranca.responsavel-padrao.identificador:FILA_COBRANCA}")
	private String responsavelPadraoIdentificador;
	@Value("${sgc.cobranca.sla-padrao-horas:24}")
	private int slaPadraoHoras = 24;
	@Value("${sgc.cobranca.primeiro-contato-minutos:30}")
	private int primeiroContatoMinutos = 30;

	public CobrancaService(ServiceRbx serviceRbx, ClienteRepository clienteRepository,
						   CobrancaRepository cobrancaRepository, CobrancaBoletoRepository boletoRepository,
						   HistoricoAtrasoRepository historicoRepository, LogAuditoriaRepository logRepository,
						   ProcessoTimelineRepository timelineRepository, TarefaCobrancaRepository tarefaRepository,
						   FaixaAtrasoConfigService faixaAtrasoService) {
		this.serviceRbx = serviceRbx;
		this.clienteRepository = clienteRepository;
		this.cobrancaRepository = cobrancaRepository;
		this.boletoRepository = boletoRepository;
		this.historicoRepository = historicoRepository;
		this.logRepository = logRepository;
		this.timelineRepository = timelineRepository;
		this.tarefaRepository = tarefaRepository;
		this.faixaAtrasoService = faixaAtrasoService;
	}

	@Transactional
	public synchronized SincronizacaoCobrancaDTO sincronizarInadimplentes() {
		LocalDate hoje = LocalDate.now();
		OffsetDateTime agora = OffsetDateTime.now();
		List<BoletosAbertos> documentos = serviceRbx.buscarTodosBoletosAbertos();
		if (documentos == null) {
			throw new IllegalStateException("O RBX não retornou a lista de documentos abertos");
		}

		Map<String, ClienteRbxDTO> clientesPorCodigo = serviceRbx.buscarTodosClientes().stream()
				.filter(cliente -> StringUtils.hasText(cliente.codigo()))
				.collect(Collectors.toMap(ClienteRbxDTO::codigo, Function.identity(), (atual, repetido) -> atual));

		int vencidos = 0;
		int ignorados = 0;
		Map<String, DocumentoPreparado> preparadosPorReferencia = new LinkedHashMap<>();
		for (BoletosAbertos documento : documentos) {
			Optional<LocalDate> vencimento = parseData(documento.vencimento());
			if (vencimento.isEmpty() || !vencimento.get().isBefore(hoje)) {
				continue;
			}
			vencidos++;

			ClienteRbxDTO clienteRbx = clientesPorCodigo.get(documento.cliente());
			String cpf = normalizarDocumento(primeiroPreenchido(
					documento.cpfCnpj(), clienteRbx == null ? null : clienteRbx.cpfCnpj()));
			String referencia = referenciaDocumento(documento);
			if (cpf.length() != 11 || !StringUtils.hasText(referencia)) {
				ignorados++;
				continue;
			}

			preparadosPorReferencia.put(referencia,
					new DocumentoPreparado(documento, clienteRbx, cpf, referencia, vencimento.get(),
							BigDecimal.valueOf(documento.valor()).setScale(2, RoundingMode.HALF_UP)));
		}

		if (vencidos > 0 && preparadosPorReferencia.isEmpty()) {
			throw new IllegalStateException("O RBX retornou documentos vencidos, mas nenhum possui CPF e referência válidos");
		}

		List<DocumentoPreparado> preparados = new ArrayList<>(preparadosPorReferencia.values());
		Set<String> cpfs = preparados.stream().map(DocumentoPreparado::cpf).collect(Collectors.toSet());
		Set<String> referencias = preparadosPorReferencia.keySet();

		Map<String, Cliente> clientesPorCpf = clienteRepository.findAllByCpfIn(cpfs).stream()
				.collect(Collectors.toMap(Cliente::getCpf, Function.identity()));
		for (DocumentoPreparado preparado : preparados) {
			Cliente cliente = clientesPorCpf.computeIfAbsent(preparado.cpf(), chave -> new Cliente());
			preencherCliente(cliente, preparado, agora);
		}
		clienteRepository.saveAll(clientesPorCpf.values());
		clienteRepository.flush();

		List<Cobranca.Status> statusesAtivos = List.of(Cobranca.Status.ABERTA, Cobranca.Status.EM_ANDAMENTO);
		List<Cobranca> todasAbertas = cobrancaRepository.findByCpfAgregadorInAndStatusIn(cpfs, statusesAtivos);
		Map<String, Cobranca> cobrancasPorContrato = todasAbertas.stream()
				.collect(Collectors.toMap(
						c -> chaveProtocolo(c.getCpfAgregador(), c.getContratoReferencia()),
						Function.identity(), (maisRecente, repetida) -> maisRecente));
		int cobrancasCriadas = 0;
		List<Cobranca> novasCobrancas = new ArrayList<>();
		for (DocumentoPreparado preparado : preparados) {
			String contrato = contratoDo(preparado.documento());
			String chave = chaveProtocolo(preparado.cpf(), contrato);
			if (!cobrancasPorContrato.containsKey(chave)) {
				Cobranca nova = novaCobranca(clientesPorCpf.get(preparado.cpf()), preparado.cpf(), contrato, agora);
				cobrancasPorContrato.put(chave, nova);
				novasCobrancas.add(nova);
				cobrancasCriadas++;
			}
		}
		for (Cobranca cobranca : todasAbertas) {
			cobranca.setValorTotal(BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP));
			cobranca.setDiasAtraso(0);
		}
		for (Cobranca cobranca : cobrancasPorContrato.values()) {
			cobranca.setCliente(clientesPorCpf.getOrDefault(cobranca.getCpfAgregador(), cobranca.getCliente()));
			cobranca.setAtualizadaEm(agora);
		}
		cobrancaRepository.saveAll(cobrancasPorContrato.values());
		cobrancaRepository.flush();
		for (Cobranca nova : novasCobrancas) {
			nova.setReferencia(gerarReferenciaCurta(nova, agora));
		}

		Map<String, CobrancaBoleto> boletosExistentes = boletoRepository.findAllByRbxDocumentoIn(referencias).stream()
				.collect(Collectors.toMap(CobrancaBoleto::getRbxDocumento, Function.identity()));
		Map<String, HistoricoAtraso> historicosExistentes =
				historicoRepository.findAllByBoletoReferenciaIn(referencias).stream()
						.collect(Collectors.toMap(HistoricoAtraso::getBoletoReferencia, Function.identity()));
		boletoRepository.desativarTodos();

		int boletosCriados = 0;
		int boletosAtualizados = 0;
		BigDecimal valorProcessado = BigDecimal.ZERO;
		List<CobrancaBoleto> boletos = new ArrayList<>(preparados.size());
		List<HistoricoAtraso> historicos = new ArrayList<>(preparados.size());
		List<LogAuditoria> logs = new ArrayList<>();

		for (DocumentoPreparado preparado : preparados) {
			Cliente cliente = clientesPorCpf.get(preparado.cpf());
			String contrato = contratoDo(preparado.documento());
			Cobranca cobranca = cobrancasPorContrato.get(chaveProtocolo(preparado.cpf(), contrato));
			CobrancaBoleto boleto = boletosExistentes.getOrDefault(preparado.referencia(), new CobrancaBoleto());
			boolean novo = boleto.getId() == null;
			if (novo) {
				boleto.setRbxDocumento(preparado.referencia());
				boleto.setPrimeiraDeteccaoEm(agora);
				boletosCriados++;
			} else {
				boletosAtualizados++;
			}
			boleto.setCobranca(cobranca);
			boleto.setContratoReferencia(contrato);
			boleto.setValor(preparado.valor());
			boleto.setVencimento(preparado.vencimento());
			boleto.setUltimaDeteccaoEm(agora);
			boleto.setAtivo(true);
			boletos.add(boleto);

			HistoricoAtraso historico = historicosExistentes
					.getOrDefault(preparado.referencia(), new HistoricoAtraso());
			preencherHistorico(historico, cliente, boleto, hoje, agora);
			historicos.add(historico);

			cobranca.setValorTotal(cobranca.getValorTotal().add(preparado.valor()));
			cobranca.setDiasAtraso(Math.max(cobranca.getDiasAtraso(),
					(int) Math.max(0, ChronoUnit.DAYS.between(preparado.vencimento(), hoje))));
			valorProcessado = valorProcessado.add(preparado.valor());
			if (novo) {
				logs.add(novoLog("BOLETO_ADICIONADO", cliente, cobranca, boleto,
						"Boleto vencido agregado à cobrança aberta", agora));
			}
		}
		for (Cobranca nova : novasCobrancas) {
			logs.add(novoLog("COBRANCA_CRIADA", nova.getCliente(), nova, null,
					"Cobrança aberta durante a sincronização de inadimplentes do RBX", agora));
		}
		cobrancasPorContrato.values().forEach(this::aplicarPoliticaAtraso);

		boletoRepository.saveAll(boletos);
		historicoRepository.saveAll(historicos);
		cobrancaRepository.saveAll(cobrancasPorContrato.values());
		logRepository.saveAll(logs);
		criarEstruturaInicial(novasCobrancas, agora);

		return new SincronizacaoCobrancaDTO(documentos.size(), vencidos, ignorados, cobrancasCriadas,
				boletosCriados, boletosAtualizados, valorProcessado);
	}

	@Transactional(readOnly = true)
	public List<CobrancaResumoDTO> listarAbertas() {
		Map<Long, Long> quantidadePorCobranca = boletoRepository.contarAtivosPorCobranca().stream()
				.collect(Collectors.toMap(
						resultado -> (Long) resultado[0],
						resultado -> (Long) resultado[1]));
		return cobrancaRepository.findByStatusInOrderByAtualizadaEmDesc(
						List.of(Cobranca.Status.ABERTA, Cobranca.Status.EM_ANDAMENTO)).stream()
				.filter(cobranca -> cobranca.getValorTotal().signum() > 0)
				.map(cobranca -> new CobrancaResumoDTO(
						cobranca.getReferencia(), cobranca.getCpfAgregador(),
						cobranca.getCliente().getNomeCompleto(), cobranca.getCliente().getTelefone(),
						cobranca.getCliente().getEmail(), cobranca.getValorTotal(),
						quantidadePorCobranca.getOrDefault(cobranca.getId(), 0L), cobranca.getAtualizadaEm(),
						cobranca.getStatus().name(), cobranca.getContratoReferencia(),
						cobranca.getCliente().getRbxCodigo(), cobranca.getPrioridade().name(),
						cobranca.getSlaHoras(), cobranca.getResponsavelNome(),
						cobranca.getEstadoFluxo(), cobranca.getEstadoFluxoDesde(),
						cobranca.getDiasAtraso(), cobranca.getFaixaAtraso().name()))
				.toList();
	}

	@Transactional(readOnly = true)
	public PaginaCobrancaDTO listarParaAtendimento(int pagina, int tamanho, String busca) {
		int tamanhoSeguro = Math.max(10, Math.min(tamanho, 100));
		Page<Cobranca> resultado = cobrancaRepository.buscarParaAtendimento(
				List.of(Cobranca.Status.ABERTA, Cobranca.Status.EM_ANDAMENTO),
				busca == null ? "" : busca.trim(),
				PageRequest.of(Math.max(pagina, 0), tamanhoSeguro, Sort.by(Sort.Direction.DESC, "atualizadaEm")));
		List<Long> ids = resultado.getContent().stream().map(Cobranca::getId).toList();
		Map<Long, Long> quantidades = ids.isEmpty() ? Map.of()
				: boletoRepository.contarAtivosPorCobrancas(ids).stream()
				.collect(Collectors.toMap(item -> (Long) item[0], item -> (Long) item[1]));
		List<CobrancaResumoDTO> itens = resultado.getContent().stream().map(cobranca ->
				new CobrancaResumoDTO(cobranca.getReferencia(), cobranca.getCpfAgregador(),
						cobranca.getCliente().getNomeCompleto(), cobranca.getCliente().getTelefone(),
						cobranca.getCliente().getEmail(), cobranca.getValorTotal(),
						quantidades.getOrDefault(cobranca.getId(), 0L), cobranca.getAtualizadaEm(),
						cobranca.getStatus().name(), cobranca.getContratoReferencia(),
						cobranca.getCliente().getRbxCodigo(), cobranca.getPrioridade().name(),
						cobranca.getSlaHoras(), cobranca.getResponsavelNome(),
						cobranca.getEstadoFluxo(), cobranca.getEstadoFluxoDesde(),
						cobranca.getDiasAtraso(), cobranca.getFaixaAtraso().name())).toList();
		return new PaginaCobrancaDTO(itens, resultado.getNumber(), resultado.getSize(),
				resultado.getTotalElements(), resultado.getTotalPages(), resultado.isFirst(), resultado.isLast());
	}

	@Transactional(readOnly = true)
	public ClienteProtocolosDTO protocolosDoCliente(String cpf) {
		String cpfNormalizado = normalizarDocumento(cpf);
		List<Cobranca> protocolos = cobrancaRepository.findByCpfAgregadorAndStatusInOrderByAtualizadaEmDesc(
				cpfNormalizado, List.of(Cobranca.Status.ABERTA, Cobranca.Status.EM_ANDAMENTO));
		if (protocolos.isEmpty()) {
			throw new IllegalArgumentException("Cliente sem protocolos ativos");
		}
		List<Long> ids = protocolos.stream().map(Cobranca::getId).toList();
		Map<Long, Long> quantidades = boletoRepository.contarAtivosPorCobrancas(ids).stream()
				.collect(Collectors.toMap(item -> (Long) item[0], item -> (Long) item[1]));
		List<CobrancaResumoDTO> itens = protocolos.stream()
				.filter(protocolo -> protocolo.getValorTotal().signum() > 0)
				.map(protocolo -> resumo(protocolo, quantidades.getOrDefault(protocolo.getId(), 0L)))
				.toList();
		BigDecimal total = itens.stream().map(CobrancaResumoDTO::valorTotal)
				.reduce(BigDecimal.ZERO, BigDecimal::add);
		return new ClienteProtocolosDTO(cpfNormalizado, protocolos.getFirst().getCliente().getNomeCompleto(),
				total, itens);
	}

	private void preencherCliente(Cliente cliente, DocumentoPreparado preparado, OffsetDateTime agora) {
		ClienteRbxDTO origem = preparado.clienteRbx();
		BoletosAbertos documento = preparado.documento();
		cliente.setCpf(preparado.cpf());
		cliente.setRbxCodigo(limitar(primeiroPreenchido(
				documento.cliente(), origem == null ? null : origem.codigo()), 80));
		cliente.setNomeCompleto(valorOuPadrao(primeiroPreenchido(
				documento.nome(), origem == null ? null : origem.nome()), "Cliente sem nome no RBX"));
		cliente.setTelefone(limitar(primeiroPreenchido(
				documento.telefone1(), documento.telefone2(), documento.telefone3(),
				origem == null ? null : origem.telCelular(),
				origem == null ? null : origem.telResidencial(),
				origem == null ? null : origem.telComercial()), 80));
		cliente.setEmail(limitar(origem == null ? null : origem.email(), 254));
		cliente.setAtualizadoEm(agora);
	}

	private Cobranca novaCobranca(Cliente cliente, String cpf, String contrato, OffsetDateTime agora) {
		Cobranca cobranca = new Cobranca();
		cobranca.setReferencia("TEMP-" + java.util.UUID.randomUUID());
		cobranca.setCliente(cliente);
		cobranca.setCpfAgregador(cpf);
		cobranca.setContratoReferencia(contrato);
		cobranca.setOperadorNome("Integração RBX");
		cobranca.setOperadorIdentificador("RBX");
		cobranca.setResponsavelNome(responsavelPadraoNome);
		cobranca.setResponsavelIdentificador(responsavelPadraoIdentificador);
		cobranca.setPrioridade(Cobranca.Prioridade.MEDIA);
		cobranca.setSlaHoras(slaPadraoHoras);
		cobranca.setCriadaEm(agora);
		cobranca.setAtualizadaEm(agora);
		cobranca.setUltimaMovimentacaoEm(agora);
		return cobranca;
	}

	private String gerarReferenciaCurta(Cobranca cobranca, OffsetDateTime agora) {
		String dataHora = agora.format(java.time.format.DateTimeFormatter.ofPattern("ddMMyyyyHHmmss"));
		String clienteRbx = valorOuPadrao(cobranca.getCliente().getRbxCodigo(), "SGC")
				.replaceAll("[^A-Za-z0-9]", "");
		if (clienteRbx.length() > 16) clienteRbx = clienteRbx.substring(0, 16);
		// O ID interno diferencia contratos do mesmo cliente criados no mesmo segundo.
		return dataHora + "-" + clienteRbx + "-" + cobranca.getId();
	}

	private CobrancaResumoDTO resumo(Cobranca cobranca, long quantidadeBoletos) {
		return new CobrancaResumoDTO(cobranca.getReferencia(), cobranca.getCpfAgregador(),
				cobranca.getCliente().getNomeCompleto(), cobranca.getCliente().getTelefone(),
				cobranca.getCliente().getEmail(), cobranca.getValorTotal(), quantidadeBoletos,
				cobranca.getAtualizadaEm(), cobranca.getStatus().name(), cobranca.getContratoReferencia(),
				cobranca.getCliente().getRbxCodigo(), cobranca.getPrioridade().name(),
				cobranca.getSlaHoras(), cobranca.getResponsavelNome(),
				cobranca.getEstadoFluxo(), cobranca.getEstadoFluxoDesde(),
				cobranca.getDiasAtraso(), cobranca.getFaixaAtraso().name());
	}

	void aplicarPoliticaAtraso(Cobranca cobranca) {
		var faixa = faixaAtrasoService.classificar(cobranca.getDiasAtraso());
		cobranca.setFaixaAtraso(Cobranca.FaixaAtraso.valueOf(faixa.getCodigo()));
		cobranca.setPrioridade(faixa.getPrioridade());
	}

	private static String contratoDo(BoletosAbertos documento) {
		return limitar(valorOuPadrao(primeiroPreenchido(
				documento.contratosVinculados(), documento.contrato()), "SEM_CONTRATO"), 120);
	}

	private static String chaveProtocolo(String cpf, String contrato) {
		return cpf + "|" + valorOuPadrao(contrato, "SEM_CONTRATO");
	}

	private void criarEstruturaInicial(List<Cobranca> novas, OffsetDateTime agora) {
		List<ProcessoTimeline> timelines = new ArrayList<>();
		List<TarefaCobranca> tarefas = new ArrayList<>();
		for (Cobranca cobranca : novas) {
			ProcessoTimeline timeline = new ProcessoTimeline();
			timeline.setCobranca(cobranca);
			timeline.setEvento("PROCESSO_CRIADO");
			timeline.setDescricao("Processo criado automaticamente após recebimento da inadimplência do RBX");
			timeline.setAutorNome(cobranca.getOperadorNome());
			timeline.setAutorIdentificador(cobranca.getOperadorIdentificador());
			timeline.setCriadoEm(agora);
			timelines.add(timeline);

			TarefaCobranca tarefa = new TarefaCobranca();
			tarefa.setCobranca(cobranca);
			tarefa.setTipo("PRIMEIRO_CONTATO_WHATSAPP");
			tarefa.setTitulo("Realizar primeiro contato por WhatsApp");
			tarefa.setPrioridade(cobranca.getPrioridade());
			tarefa.setResponsavelNome(cobranca.getResponsavelNome());
			tarefa.setResponsavelIdentificador(cobranca.getResponsavelIdentificador());
			tarefa.setCriadaEm(agora);
			tarefa.setPrazoEm(agora.plusMinutes(primeiroContatoMinutos));
			tarefas.add(tarefa);
		}
		timelineRepository.saveAll(timelines);
		tarefaRepository.saveAll(tarefas);
	}

	private void adicionarContrato(Cobranca cobranca, String contrato) {
		if (!StringUtils.hasText(contrato)) return;
		if (!StringUtils.hasText(cobranca.getContratoReferencia())
				|| "NAO_INFORMADO".equals(cobranca.getContratoReferencia())) {
			cobranca.setContratoReferencia(contrato);
			return;
		}
		List<String> atuais = List.of(cobranca.getContratoReferencia().split(","));
		if (!atuais.contains(contrato)) {
			cobranca.setContratoReferencia(limitar(cobranca.getContratoReferencia() + "," + contrato, 500));
		}
	}

	private void preencherHistorico(HistoricoAtraso historico, Cliente cliente, CobrancaBoleto boleto,
									LocalDate hoje, OffsetDateTime agora) {
		if (historico.getId() == null) {
			historico.setPrimeiraDeteccaoEm(agora);
		}
		historico.setCpf(cliente.getCpf());
		historico.setClienteNome(cliente.getNomeCompleto());
		historico.setBoletoReferencia(boleto.getRbxDocumento());
		historico.setContratoReferencia(boleto.getContratoReferencia());
		historico.setValor(boleto.getValor());
		historico.setVencimento(boleto.getVencimento());
		historico.setDiasAtraso(Math.max(0, ChronoUnit.DAYS.between(boleto.getVencimento(), hoje)));
		historico.setSituacao("EM_ATRASO");
		historico.setUltimaDeteccaoEm(agora);
	}

	private LogAuditoria novoLog(String evento, Cliente cliente, Cobranca cobranca, CobrancaBoleto boleto,
								 String descricao, OffsetDateTime agora) {
		LogAuditoria log = new LogAuditoria();
		log.setEvento(evento);
		log.setCpf(cliente.getCpf());
		log.setClienteNome(cliente.getNomeCompleto());
		log.setUsuarioNome("Integração RBX");
		log.setUsuarioIdentificador("RBX");
		log.setCobrancaReferencia(cobranca.getReferencia());
		log.setBoletoReferencia(boleto == null ? null : boleto.getRbxDocumento());
		log.setDescricao(descricao);
		log.setCriadoEm(agora);
		return log;
	}

	private static String referenciaDocumento(BoletosAbertos documento) {
		if (!StringUtils.hasText(documento.documento())) return null;
		return String.join(":",
				valorOuPadrao(documento.conta(), "0"),
				documento.documento().trim(),
				valorOuPadrao(documento.sequencia(), "0"));
	}

	private static Optional<LocalDate> parseData(String valor) {
		if (!StringUtils.hasText(valor)) return Optional.empty();
		for (DateTimeFormatter formato : FORMATOS_DATA) {
			try {
				return Optional.of(LocalDate.parse(valor.trim(), formato));
			} catch (DateTimeParseException ignored) {
				// tenta o próximo formato conhecido do RBX
			}
		}
		return Optional.empty();
	}

	private static String normalizarDocumento(String valor) {
		return valor == null ? "" : valor.replaceAll("\\D", "");
	}

	private static String primeiroPreenchido(String... valores) {
		for (String valor : valores) if (StringUtils.hasText(valor)) return valor.trim();
		return null;
	}

	private static String valorOuPadrao(String valor, String padrao) {
		return StringUtils.hasText(valor) ? valor.trim() : padrao;
	}

	private static String limitar(String valor, int limite) {
		if (!StringUtils.hasText(valor)) return null;
		String texto = valor.trim();
		return texto.length() <= limite ? texto : texto.substring(0, limite);
	}

	private record DocumentoPreparado(
			BoletosAbertos documento,
			ClienteRbxDTO clienteRbx,
			String cpf,
			String referencia,
			LocalDate vencimento,
			BigDecimal valor
	) {
	}
}
