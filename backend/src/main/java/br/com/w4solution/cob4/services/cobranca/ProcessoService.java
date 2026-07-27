package br.com.w4solution.cob4.services.cobranca;

import br.com.w4solution.cob4.domain.Cobranca;
import br.com.w4solution.cob4.domain.ProcessoTimeline;
import br.com.w4solution.cob4.dto.cobranca.EncerrarProcessoDTO;
import br.com.w4solution.cob4.repositories.CobrancaRepository;
import br.com.w4solution.cob4.repositories.ProcessoTimelineRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;

@Service
public class ProcessoService {
	private final CobrancaRepository cobrancaRepository;
	private final ProcessoTimelineRepository timelineRepository;

	public ProcessoService(CobrancaRepository cobrancaRepository, ProcessoTimelineRepository timelineRepository) {
		this.cobrancaRepository = cobrancaRepository;
		this.timelineRepository = timelineRepository;
	}

	@Transactional
	public void encerrar(String referencia, EncerrarProcessoDTO dados) {
		Cobranca processo = cobrancaRepository.findByReferencia(referencia)
				.orElseThrow(() -> new IllegalArgumentException("Processo não encontrado"));
		if (processo.encerrada()) {
			throw new IllegalStateException("RN-006: o processo já está encerrado");
		}
		OffsetDateTime agora = OffsetDateTime.now();
		processo.setStatus(Cobranca.Status.ENCERRADA);
		processo.setMotivoEncerramento(dados.motivo().trim());
		processo.setEncerradaEm(agora);
		processo.setOperadorNome(dados.operadorNome().trim());
		processo.setOperadorIdentificador(dados.operadorIdentificador().trim());
		processo.setUltimaMovimentacaoEm(agora);
		processo.setAtualizadaEm(agora);
		cobrancaRepository.save(processo);

		ProcessoTimeline timeline = new ProcessoTimeline();
		timeline.setCobranca(processo);
		timeline.setEvento("PROCESSO_ENCERRADO");
		timeline.setDescricao("Processo encerrado. Motivo: " + dados.motivo().trim());
		timeline.setAutorNome(dados.operadorNome().trim());
		timeline.setAutorIdentificador(dados.operadorIdentificador().trim());
		timeline.setCriadoEm(agora);
		timelineRepository.save(timeline);
	}
}
