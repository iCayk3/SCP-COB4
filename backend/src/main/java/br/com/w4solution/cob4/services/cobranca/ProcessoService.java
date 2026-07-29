package br.com.w4solution.cob4.services.cobranca;

import br.com.w4solution.cob4.domain.Cobranca;
import br.com.w4solution.cob4.domain.ProcessoTimeline;
import br.com.w4solution.cob4.domain.MotivoCatalogo;
import br.com.w4solution.cob4.dto.cobranca.EncerrarProcessoDTO;
import br.com.w4solution.cob4.dto.cobranca.ReabrirProcessoDTO;
import br.com.w4solution.cob4.repositories.CobrancaRepository;
import br.com.w4solution.cob4.repositories.ProcessoTimelineRepository;
import br.com.w4solution.cob4.services.catalogo.MotivoCatalogoService;
import br.com.w4solution.cob4.security.AcaoSistema;
import br.com.w4solution.cob4.security.AutorizacaoService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;

@Service
public class ProcessoService {
	private final CobrancaRepository cobrancaRepository;
	private final ProcessoTimelineRepository timelineRepository;
	private final MotivoCatalogoService motivoService;
	private final AutorizacaoService autorizacaoService;

	public ProcessoService(CobrancaRepository cobrancaRepository, ProcessoTimelineRepository timelineRepository,
						   MotivoCatalogoService motivoService, AutorizacaoService autorizacaoService) {
		this.cobrancaRepository = cobrancaRepository;
		this.timelineRepository = timelineRepository;
		this.motivoService = motivoService;
		this.autorizacaoService = autorizacaoService;
	}

	@Transactional
	public void reabrir(String referencia, ReabrirProcessoDTO dados) {
		var usuario = autorizacaoService.exigir(AcaoSistema.REABRIR_PROTOCOLO);
		Cobranca processo = cobrancaRepository.findByReferencia(referencia)
				.orElseThrow(() -> new IllegalArgumentException("Processo não encontrado"));
		if (!processo.encerrada()) throw new IllegalStateException("Somente processos encerrados podem ser reabertos");
		var motivo = motivoService.validarAtivo(MotivoCatalogo.Tipo.REABERTURA,
				dados.motivoCodigo(), dados.observacao());
		OffsetDateTime agora = OffsetDateTime.now();
		processo.autorizarReabertura();
		processo.setStatus(Cobranca.Status.EM_ANDAMENTO);
		processo.setEstadoFluxo("EM_ATENDIMENTO");
		processo.setEstadoFluxoDesde(agora);
		processo.setEncerradaEm(null);
		processo.setMotivoReaberturaCodigo(motivo.getCodigo());
		processo.setMotivoReaberturaNome(motivo.getNome());
		processo.setObservacaoReabertura(limpar(dados.observacao()));
		processo.setOperadorNome(usuario.nome());
		processo.setOperadorIdentificador(usuario.identificador());
		processo.setUltimaMovimentacaoEm(agora); processo.setAtualizadaEm(agora);
		processo.setSlaAlertadoEm(null);
		processo.setSlaPausadoEm(null);
		processo.setSlaPausaSegundos(0);
		processo.setSlaEscalonamentoNivel(0);
		processo.setSlaUltimaNotificacaoEm(null);
		cobrancaRepository.save(processo);
		ProcessoTimeline timeline = new ProcessoTimeline();
		timeline.setCobranca(processo); timeline.setEvento("PROCESSO_REABERTO");
		timeline.setDescricao("Processo reaberto. Motivo [" + motivo.getCodigo() + "]: " + motivo.getNome()
				+ complemento(dados.observacao()));
		timeline.setAutorNome(usuario.nome());
		timeline.setAutorIdentificador(usuario.identificador());
		timeline.setCriadoEm(agora); timelineRepository.save(timeline);
	}

	@Transactional
	public void encerrar(String referencia, EncerrarProcessoDTO dados) {
		var usuario = autorizacaoService.exigir(AcaoSistema.ENCERRAR_PROTOCOLO);
		Cobranca processo = cobrancaRepository.findByReferencia(referencia)
				.orElseThrow(() -> new IllegalArgumentException("Processo não encontrado"));
		if (processo.encerrada()) {
			throw new IllegalStateException("RN-006: o processo já está encerrado");
		}
		var motivo = motivoService.validarAtivo(MotivoCatalogo.Tipo.ENCERRAMENTO,
				dados.motivoCodigo(), dados.observacao());
		OffsetDateTime agora = OffsetDateTime.now();
		processo.setStatus(Cobranca.Status.ENCERRADA);
		processo.setMotivoEncerramento(motivo.getNome());
		processo.setMotivoEncerramentoCodigo(motivo.getCodigo());
		processo.setMotivoEncerramentoNome(motivo.getNome());
		processo.setObservacaoEncerramento(limpar(dados.observacao()));
		processo.setEncerradaEm(agora);
		processo.setOperadorNome(usuario.nome());
		processo.setOperadorIdentificador(usuario.identificador());
		processo.setUltimaMovimentacaoEm(agora);
		processo.setAtualizadaEm(agora);
		cobrancaRepository.save(processo);

		ProcessoTimeline timeline = new ProcessoTimeline();
		timeline.setCobranca(processo);
		timeline.setEvento("PROCESSO_ENCERRADO");
		timeline.setDescricao("Processo encerrado. Motivo [" + motivo.getCodigo() + "]: " + motivo.getNome()
				+ complemento(dados.observacao()));
		timeline.setAutorNome(usuario.nome());
		timeline.setAutorIdentificador(usuario.identificador());
		timeline.setCriadoEm(agora);
		timelineRepository.save(timeline);
	}

	private String limpar(String valor) {
		return valor == null || valor.isBlank() ? null : valor.trim();
	}

	private String complemento(String observacao) {
		return observacao == null || observacao.isBlank() ? "" : ". Observação: " + observacao.trim();
	}
}
