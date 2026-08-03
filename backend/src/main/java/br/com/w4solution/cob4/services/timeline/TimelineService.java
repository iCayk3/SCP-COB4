package br.com.w4solution.cob4.services.timeline;

import br.com.w4solution.cob4.domain.Cobranca;
import br.com.w4solution.cob4.domain.ProcessoTimeline;
import br.com.w4solution.cob4.dto.timeline.EventoTimelineDTO;
import br.com.w4solution.cob4.repositories.CobrancaRepository;
import br.com.w4solution.cob4.repositories.ProcessoTimelineRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import br.com.w4solution.cob4.dto.api.PaginaDTO;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

@Service
public class TimelineService {
	private final CobrancaRepository cobrancaRepository;
	private final ProcessoTimelineRepository timelineRepository;

	public TimelineService(CobrancaRepository cobrancaRepository,
						   ProcessoTimelineRepository timelineRepository) {
		this.cobrancaRepository = cobrancaRepository;
		this.timelineRepository = timelineRepository;
	}

	@Transactional(readOnly = true)
	public List<EventoTimelineDTO> listar(String referencia) {
		if (cobrancaRepository.findByReferencia(referencia).isEmpty()) {
			throw new IllegalArgumentException("Processo não encontrado");
		}
		return timelineRepository.findByCobrancaReferenciaOrderByCriadoEmAscIdAsc(referencia)
				.stream().map(this::resumo).toList();
	}

	@Transactional(readOnly = true)
	public PaginaDTO<EventoTimelineDTO> listarPaginado(String referencia, int pagina, int tamanho) {
		cobrancaRepository.findByReferencia(referencia)
				.orElseThrow(() -> new java.util.NoSuchElementException("Processo nao encontrado"));
		if (pagina < 0 || tamanho < 1 || tamanho > 100) throw new IllegalArgumentException("Paginacao invalida");
		return PaginaDTO.de(timelineRepository.findByCobrancaReferencia(referencia,
				PageRequest.of(pagina, tamanho, Sort.by(Sort.Direction.DESC, "criadoEm").and(Sort.by(Sort.Direction.DESC, "id")))),
				this::resumo);
	}

	@Transactional
	public EventoTimelineDTO registrar(String referencia, String evento, String descricao,
									   String autorNome, String autorIdentificador) {
		Cobranca processo = cobrancaRepository.findByReferencia(referencia)
				.orElseThrow(() -> new IllegalArgumentException("Processo não encontrado"));
		ProcessoTimeline registro = new ProcessoTimeline();
		registro.setCobranca(processo);
		registro.setEvento(evento);
		registro.setDescricao(descricao);
		registro.setAutorNome(autorNome);
		registro.setAutorIdentificador(autorIdentificador);
		registro.setCriadoEm(OffsetDateTime.now());
		return resumo(timelineRepository.save(registro));
	}

	private EventoTimelineDTO resumo(ProcessoTimeline registro) {
		return new EventoTimelineDTO(registro.getId(), registro.getCobranca().getReferencia(),
				registro.getEvento(), registro.getDescricao(), registro.getAutorNome(),
				registro.getAutorIdentificador(), registro.getCriadoEm());
	}
}
