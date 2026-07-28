package br.com.w4solution.cob4.services.fluxo;

import br.com.w4solution.cob4.domain.*;
import br.com.w4solution.cob4.dto.fluxo.AlterarEstadoDTO;
import br.com.w4solution.cob4.dto.fluxo.EstadoProcessoDTO;
import br.com.w4solution.cob4.dto.fluxo.AlterarEstadoLoteDTO;
import br.com.w4solution.cob4.dto.fluxo.ResultadoAlteracaoLoteDTO;
import br.com.w4solution.cob4.repositories.*;
import br.com.w4solution.cob4.services.catalogo.MotivoCatalogoService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.UUID;

@Service
public class EstadoProcessoService {
	private final CobrancaRepository cobrancaRepository;
	private final FluxoCobrancaRepository fluxoRepository;
	private final FluxoEstadoRepository estadoRepository;
	private final FluxoTransicaoRepository transicaoRepository;
	private final ProcessoTimelineRepository timelineRepository;
	private final MotivoCatalogoService motivoService;

	public EstadoProcessoService(CobrancaRepository cobrancaRepository, FluxoCobrancaRepository fluxoRepository,
								 FluxoEstadoRepository estadoRepository, FluxoTransicaoRepository transicaoRepository,
								 ProcessoTimelineRepository timelineRepository,
								 MotivoCatalogoService motivoService) {
		this.cobrancaRepository = cobrancaRepository; this.fluxoRepository = fluxoRepository;
		this.estadoRepository = estadoRepository; this.transicaoRepository = transicaoRepository;
		this.timelineRepository = timelineRepository;
		this.motivoService = motivoService;
	}

	@Transactional(readOnly = true)
	public EstadoProcessoDTO consultar(String referencia) {
		Cobranca processo = processo(referencia);
		FluxoCobranca fluxo = fluxo(processo);
		FluxoEstado atual = estadoRepository.findByFluxoIdAndCodigo(fluxo.getId(), processo.getEstadoFluxo())
				.orElseThrow(() -> new IllegalStateException("Estado atual não existe no fluxo configurado"));
		var destinos = transicaoRepository.findByFluxoIdAndOrigemCodigoOrderByIdAsc(fluxo.getId(), atual.getCodigo())
				.stream().filter(t -> !t.isAutomatica())
				.filter(t -> permitidoPelaFaixa(processo, t.getDestinoCodigo())).map(t -> {
					FluxoEstado destino = estadoRepository.findByFluxoIdAndCodigo(fluxo.getId(), t.getDestinoCodigo()).orElseThrow();
					return new EstadoProcessoDTO.DestinoDTO(destino.getCodigo(), destino.getNome(), t.getNome());
				}).toList();
		return new EstadoProcessoDTO(fluxo.getCodigo(), fluxo.getNome(), atual.getCodigo(), atual.getNome(),
				processo.getEstadoFluxoDesde(), destinos);
	}

	@Transactional
	public EstadoProcessoDTO alterar(String referencia, AlterarEstadoDTO dados) {
		Cobranca processo = processo(referencia);
		FluxoCobranca fluxo = fluxo(processo);
		String destino = FluxoService.normalizar(dados.destino());
		validarFaixa(processo, destino);
		transicaoRepository.findByFluxoIdAndOrigemCodigoAndDestinoCodigo(
				fluxo.getId(), processo.getEstadoFluxo(), destino)
				.orElseThrow(() -> new IllegalStateException("Transição não permitida pelo fluxo"));
		var motivo = motivoService.validarAtivo(motivoService.tipoParaDestino(destino),
				dados.motivoCodigo(), dados.observacao());
		mover(processo, destino, dados.operadorNome(), dados.operadorIdentificador(),
				motivo.getCodigo(), motivo.getNome(), dados.observacao());
		return consultar(referencia);
	}

	@Transactional
	public ResultadoAlteracaoLoteDTO alterarEmLote(AlterarEstadoLoteDTO dados) {
		List<String> referencias = new LinkedHashSet<>(dados.referencias()).stream().toList();
		if (referencias.size() < 2) {
			throw new IllegalArgumentException("Selecione pelo menos dois protocolos");
		}
		List<Cobranca> processos = cobrancaRepository.findAllByReferenciaIn(referencias);
		if (processos.size() != referencias.size()) {
			throw new IllegalArgumentException("Um ou mais protocolos não foram encontrados");
		}
		if (processos.stream().map(Cobranca::getCpfAgregador).distinct().count() != 1) {
			throw new IllegalArgumentException("A operação conjunta só pode envolver protocolos do mesmo cliente");
		}
		String destino = FluxoService.normalizar(dados.destino());
		for (Cobranca processo : processos) {
			if (processo.encerrada()) {
				throw new IllegalStateException("O protocolo " + processo.getReferencia() + " está encerrado");
			}
			FluxoCobranca fluxo = fluxo(processo);
			validarFaixa(processo, destino);
			transicaoRepository.findByFluxoIdAndOrigemCodigoAndDestinoCodigo(
					fluxo.getId(), processo.getEstadoFluxo(), destino)
					.orElseThrow(() -> new IllegalStateException(
							"O protocolo " + processo.getReferencia() + " não pode ir de "
									+ processo.getEstadoFluxo() + " para " + destino));
		}
		String operacaoId = "NEG-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
		String observacao = "Operação conjunta " + operacaoId
				+ (dados.observacao() == null || dados.observacao().isBlank()
				? "" : ". " + dados.observacao().trim());
		var motivoCatalogado = motivoService.validarAtivo(motivoService.tipoParaDestino(destino),
				dados.motivoCodigo(), dados.observacao());
		for (Cobranca processo : processos) {
			mover(processo, destino, dados.operadorNome(), dados.operadorIdentificador(),
					motivoCatalogado.getCodigo(), motivoCatalogado.getNome(), observacao);
		}
		return new ResultadoAlteracaoLoteDTO(operacaoId, referencias, destino);
	}

	@Transactional
	public EstadoProcessoDTO atribuirFluxo(String referencia, br.com.w4solution.cob4.dto.fluxo.AtribuirFluxoDTO dados) {
		Cobranca processo = processo(referencia);
		FluxoCobranca novoFluxo = fluxoRepository.findByCodigo(dados.fluxoCodigo())
				.filter(FluxoCobranca::isAtivo)
				.orElseThrow(() -> new IllegalArgumentException("Fluxo ativo não encontrado"));
		FluxoEstado inicial = estadoRepository.findByFluxoIdOrderByOrdemAsc(novoFluxo.getId()).stream()
				.filter(FluxoEstado::isInicial).findFirst()
				.orElseThrow(() -> new IllegalStateException("Fluxo sem estado inicial"));
		String fluxoAnterior = processo.getFluxoCodigo();
		String estadoAnterior = processo.getEstadoFluxo();
		OffsetDateTime agora = OffsetDateTime.now();
		processo.setFluxoCodigo(novoFluxo.getCodigo()); processo.setEstadoFluxo(inicial.getCodigo());
		processo.setEstadoFluxoDesde(agora); processo.setAtualizadaEm(agora); processo.setUltimaMovimentacaoEm(agora);
		cobrancaRepository.save(processo);
		ProcessoTimeline timeline = new ProcessoTimeline();
		timeline.setCobranca(processo); timeline.setEvento("FLUXO_ATRIBUIDO");
		timeline.setDescricao("Fluxo alterado de " + fluxoAnterior + "/" + estadoAnterior + " para "
				+ novoFluxo.getCodigo() + "/" + inicial.getCodigo());
		timeline.setAutorNome(dados.operadorNome()); timeline.setAutorIdentificador(dados.operadorIdentificador());
		timeline.setCriadoEm(agora); timelineRepository.save(timeline);
		return consultar(referencia);
	}

	@Transactional
	public void moverAutomaticamente(Cobranca processo, String destino, String motivo) {
		mover(processo, destino, "Automação SGC", "AUTOMACAO_SGC",
				"AUTOMACAO_SISTEMA", "Automação do sistema", motivo);
	}

	private void mover(Cobranca processo, String destino, String autor, String autorId,
					   String motivoCodigo, String motivoNome, String observacao) {
		String origem = processo.getEstadoFluxo();
		OffsetDateTime agora = OffsetDateTime.now();
		processo.setEstadoFluxo(destino); processo.setEstadoFluxoDesde(agora);
		processo.setUltimaMovimentacaoEm(agora); processo.setAtualizadaEm(agora);
		if ("ENCERRADO".equals(destino)) {
			processo.setStatus(Cobranca.Status.ENCERRADA);
			processo.setEncerradaEm(agora);
			processo.setMotivoEncerramento(motivoNome);
			processo.setMotivoEncerramentoCodigo(motivoCodigo);
			processo.setMotivoEncerramentoNome(motivoNome);
			processo.setObservacaoEncerramento(observacao == null || observacao.isBlank() ? null : observacao.trim());
		} else {
			processo.setStatus(Cobranca.Status.EM_ANDAMENTO);
		}
		cobrancaRepository.save(processo);
		ProcessoTimeline timeline = new ProcessoTimeline();
		timeline.setCobranca(processo); timeline.setEvento("ESTADO_ALTERADO");
		timeline.setDescricao("Estado alterado de " + origem + " para " + destino
				+ ". Motivo [" + motivoCodigo + "]: " + motivoNome
				+ (observacao == null || observacao.isBlank() ? "" : ". Observação: " + observacao.trim()));
		timeline.setAutorNome(autor); timeline.setAutorIdentificador(autorId); timeline.setCriadoEm(agora);
		timelineRepository.save(timeline);
	}

	private void validarFaixa(Cobranca processo, String destino) {
		if (!permitidoPelaFaixa(processo, destino)) {
			String faixaMinima = switch (destino) {
				case "VISITA" -> "F4";
				case "RETIRADA" -> "F5";
				case "JURIDICO" -> "F6";
				default -> "";
			};
			throw new IllegalStateException("O protocolo " + processo.getReferencia()
					+ " está na faixa " + processo.getFaixaAtraso() + "; "
					+ destino + " exige a faixa " + faixaMinima + " ou superior");
		}
	}

	private boolean permitidoPelaFaixa(Cobranca processo, String destino) {
		if ("SEM_CONTATO".equals(processo.getEstadoFluxo()) && "VISITA".equals(destino)) {
			return true;
		}
		return switch (destino) {
			case "VISITA" -> processo.getFaixaAtraso().ordinal() >= Cobranca.FaixaAtraso.F4_AVANCADO.ordinal();
			case "RETIRADA" -> processo.getFaixaAtraso().ordinal() >= Cobranca.FaixaAtraso.F5_CRITICO.ordinal();
			case "JURIDICO" -> processo.getFaixaAtraso().ordinal() >= Cobranca.FaixaAtraso.F6_JURIDICO.ordinal();
			default -> true;
		};
	}

	private Cobranca processo(String referencia) {
		return cobrancaRepository.findByReferencia(referencia)
				.orElseThrow(() -> new IllegalArgumentException("Processo não encontrado"));
	}
	private FluxoCobranca fluxo(Cobranca processo) {
		return fluxoRepository.findByCodigo(processo.getFluxoCodigo())
				.orElseThrow(() -> new IllegalStateException("Fluxo do processo não está configurado"));
	}
}
