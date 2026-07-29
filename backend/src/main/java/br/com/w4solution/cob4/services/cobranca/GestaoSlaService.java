package br.com.w4solution.cob4.services.cobranca;

import br.com.w4solution.cob4.domain.Cobranca;
import br.com.w4solution.cob4.domain.ProcessoTimeline;
import br.com.w4solution.cob4.repositories.CobrancaRepository;
import br.com.w4solution.cob4.repositories.ProcessoTimelineRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;

@Service
public class GestaoSlaService {
	private final CobrancaRepository cobrancaRepository;
	private final ProcessoTimelineRepository timelineRepository;
	private final CalendarioSlaService calendario;

	public GestaoSlaService(CobrancaRepository cobrancaRepository, ProcessoTimelineRepository timelineRepository,
			CalendarioSlaService calendario) {
		this.cobrancaRepository = cobrancaRepository;
		this.timelineRepository = timelineRepository;
		this.calendario = calendario;
	}

	@Transactional
	public void pausar(String referencia, String motivo, String autorNome, String autorIdentificador) {
		Cobranca processo = ativo(referencia);
		if (processo.getSlaPausadoEm() != null) throw new IllegalStateException("O SLA já está pausado");
		OffsetDateTime agora = OffsetDateTime.now();
		processo.setSlaPausadoEm(agora);
		processo.setAtualizadaEm(agora);
		registrar(processo, "SLA_PAUSADO", "SLA pausado. Motivo: " + motivo.trim(),
				autorNome, autorIdentificador, agora);
	}

	@Transactional
	public void retomar(String referencia, String motivo, String autorNome, String autorIdentificador) {
		Cobranca processo = ativo(referencia);
		if (processo.getSlaPausadoEm() == null) throw new IllegalStateException("O SLA não está pausado");
		OffsetDateTime agora = OffsetDateTime.now();
		long pausa = calendario.duracaoUtilEntre(processo.getSlaPausadoEm(), agora).getSeconds();
		processo.setSlaPausaSegundos(processo.getSlaPausaSegundos() + pausa);
		processo.setSlaPausadoEm(null);
		processo.setAtualizadaEm(agora);
		registrar(processo, "SLA_RETOMADO", "SLA retomado. Motivo: " + motivo.trim(),
				autorNome, autorIdentificador, agora);
	}

	private Cobranca ativo(String referencia) {
		Cobranca processo = cobrancaRepository.findByReferencia(referencia)
				.orElseThrow(() -> new IllegalArgumentException("Processo não encontrado"));
		if (processo.encerrada()) throw new IllegalStateException("Não é possível alterar o SLA de processo encerrado");
		return processo;
	}

	private void registrar(Cobranca processo, String evento, String descricao,
			String autorNome, String autorIdentificador, OffsetDateTime agora) {
		ProcessoTimeline timeline = new ProcessoTimeline();
		timeline.setCobranca(processo);
		timeline.setEvento(evento);
		timeline.setDescricao(descricao);
		timeline.setAutorNome(autorNome);
		timeline.setAutorIdentificador(autorIdentificador);
		timeline.setCriadoEm(agora);
		timelineRepository.save(timeline);
	}
}
