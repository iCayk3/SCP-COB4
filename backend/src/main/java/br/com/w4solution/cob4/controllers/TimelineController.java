package br.com.w4solution.cob4.controllers;

import br.com.w4solution.cob4.dto.timeline.EventoTimelineDTO;
import br.com.w4solution.cob4.services.timeline.TimelineService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/api/processos/{referencia}/timeline")
public class TimelineController {
	private final TimelineService service;

	public TimelineController(TimelineService service) {
		this.service = service;
	}

	@GetMapping
	@PreAuthorize("@carteiraAccess.podeAcessar(#referencia)")
	public List<EventoTimelineDTO> listar(@PathVariable String referencia) {
		return service.listar(referencia);
	}

	@GetMapping("/pagina")
	@PreAuthorize("@carteiraAccess.podeAcessar(#referencia)")
	public br.com.w4solution.cob4.dto.api.PaginaDTO<EventoTimelineDTO> listarPaginado(
			@PathVariable String referencia, @RequestParam(defaultValue = "0") int pagina,
			@RequestParam(defaultValue = "50") int tamanho) {
		return service.listarPaginado(referencia, pagina, Math.min(Math.max(tamanho, 1), 100));
	}
}
