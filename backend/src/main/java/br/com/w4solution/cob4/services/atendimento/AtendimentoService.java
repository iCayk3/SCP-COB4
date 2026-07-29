package br.com.w4solution.cob4.services.atendimento;

import br.com.w4solution.cob4.domain.*;
import br.com.w4solution.cob4.dto.atendimento.AtendimentoResumoDTO;
import br.com.w4solution.cob4.dto.atendimento.RegistrarAtendimentoDTO;
import br.com.w4solution.cob4.repositories.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import br.com.w4solution.cob4.services.fluxo.EstadoProcessoService;
import br.com.w4solution.cob4.dto.fluxo.AlterarEstadoDTO;
import br.com.w4solution.cob4.security.UsuarioAtualService;

@Service
public class AtendimentoService {
	private final CobrancaRepository cobrancaRepository;
	private final AtendimentoRepository atendimentoRepository;
	private final AtendimentoMensagemRepository mensagemRepository;
	private final ProcessoTimelineRepository timelineRepository;
	private final TarefaCobrancaRepository tarefaRepository;
	private final EstadoProcessoService estadoProcessoService;
	private final UsuarioAtualService usuarioAtualService;

	public AtendimentoService(CobrancaRepository cobrancaRepository, AtendimentoRepository atendimentoRepository,
							  AtendimentoMensagemRepository mensagemRepository,
							  ProcessoTimelineRepository timelineRepository,
							  TarefaCobrancaRepository tarefaRepository,
							  EstadoProcessoService estadoProcessoService,
							  UsuarioAtualService usuarioAtualService) {
		this.cobrancaRepository = cobrancaRepository;
		this.atendimentoRepository = atendimentoRepository;
		this.mensagemRepository = mensagemRepository;
		this.timelineRepository = timelineRepository;
		this.tarefaRepository = tarefaRepository;
		this.estadoProcessoService = estadoProcessoService;
		this.usuarioAtualService = usuarioAtualService;
	}

	@Transactional
	public AtendimentoResumoDTO registrar(String referencia, RegistrarAtendimentoDTO dados) {
		var usuario = usuarioAtualService.atual();
		Cobranca processo = cobrancaRepository.findByReferencia(referencia)
				.orElseThrow(() -> new IllegalArgumentException("Processo não encontrado"));
		if (processo.encerrada()) {
			throw new IllegalStateException("RN-006: não é possível atender um processo encerrado");
		}
		OffsetDateTime agora = OffsetDateTime.now();
		Atendimento atendimento = new Atendimento();
		atendimento.setCobranca(processo);
		atendimento.setCanal(dados.canal());
		atendimento.setResultado(dados.resultado());
		atendimento.setObservacao(dados.observacao().trim());
		atendimento.setProximaAcao(dados.proximaAcao().trim());
		atendimento.setOperadorNome(usuario.nome());
		atendimento.setOperadorIdentificador(usuario.identificador());
		atendimento.setRealizadoEm(agora);
		atendimentoRepository.save(atendimento);

		List<AtendimentoMensagem> mensagens = dados.mensagens().stream().map(item -> {
			AtendimentoMensagem mensagem = new AtendimentoMensagem();
			mensagem.setAtendimento(atendimento);
			mensagem.setAutor(item.autor());
			mensagem.setMensagem(item.mensagem().trim());
			mensagem.setEnviadaEm(agora);
			return mensagem;
		}).toList();
		mensagemRepository.saveAll(mensagens);
		if ("NOVO".equals(processo.getEstadoFluxo())
				&& mensagens.stream().anyMatch(m -> m.getAutor() == AtendimentoMensagem.Autor.CLIENTE)) {
			estadoProcessoService.alterar(referencia, new AlterarEstadoDTO(
					"EM_ATENDIMENTO", usuario.nome(), usuario.identificador(),
					"CONTATO_REALIZADO",
					"Cliente respondeu pelo chat."));
		}
		if ("NOVO".equals(processo.getEstadoFluxo()) && dados.resultado() == Atendimento.Resultado.SEM_CONTATO) {
			estadoProcessoService.alterar(referencia, new AlterarEstadoDTO(
					"SEM_CONTATO", usuario.nome(), usuario.identificador(),
					"SEM_RETORNO_DO_CLIENTE",
					"Tentativa por ligação concluída sem contato."));
		}

		processo.setStatus(Cobranca.Status.EM_ANDAMENTO);
		processo.setOperadorNome(usuario.nome());
		processo.setOperadorIdentificador(usuario.identificador());
		processo.setUltimaMovimentacaoEm(agora);
		processo.setAtualizadaEm(agora);
		processo.setSlaAlertadoEm(null);
		processo.setSlaPausadoEm(null);
		processo.setSlaPausaSegundos(0);
		processo.setSlaEscalonamentoNivel(0);
		processo.setSlaUltimaNotificacaoEm(null);
		cobrancaRepository.save(processo);

		ProcessoTimeline timeline = new ProcessoTimeline();
		timeline.setCobranca(processo);
		timeline.setEvento("ATENDIMENTO_REGISTRADO");
		timeline.setDescricao("Atendimento via chat: " + dados.resultado() + ". " + dados.observacao().trim());
		timeline.setAutorNome(usuario.nome());
		timeline.setAutorIdentificador(usuario.identificador());
		timeline.setCriadoEm(agora);
		timelineRepository.save(timeline);

		TarefaCobranca tarefa = new TarefaCobranca();
		tarefa.setCobranca(processo);
		tarefa.setTipo("PROXIMA_ACAO");
		tarefa.setTitulo(dados.proximaAcao().trim());
		tarefa.setPrioridade(processo.getPrioridade());
		tarefa.setResponsavelNome(processo.getResponsavelNome());
		tarefa.setResponsavelIdentificador(processo.getResponsavelIdentificador());
		tarefa.setCriadaEm(agora);
		tarefa.setPrazoEm(agora.plusHours(processo.getSlaHoras()));
		tarefaRepository.save(tarefa);
		return resumo(atendimento);
	}

	@Transactional(readOnly = true)
	public List<AtendimentoResumoDTO> listar(String referencia) {
		return atendimentoRepository.findByCobrancaReferenciaOrderByRealizadoEmDesc(referencia)
				.stream().map(this::resumo).toList();
	}

	private AtendimentoResumoDTO resumo(Atendimento atendimento) {
		List<AtendimentoResumoDTO.MensagemResumoDTO> mensagens = mensagemRepository
				.findByAtendimentoIdOrderByEnviadaEmAscIdAsc(atendimento.getId()).stream()
				.map(item -> new AtendimentoResumoDTO.MensagemResumoDTO(item.getId(), item.getAutor().name(),
						item.getMensagem(), item.getEnviadaEm())).toList();
		return new AtendimentoResumoDTO(atendimento.getId(), atendimento.getCanal().name(),
				atendimento.getResultado().name(), atendimento.getObservacao(), atendimento.getProximaAcao(),
				atendimento.getOperadorNome(), atendimento.getOperadorIdentificador(), atendimento.getRealizadoEm(),
				mensagens);
	}
}
