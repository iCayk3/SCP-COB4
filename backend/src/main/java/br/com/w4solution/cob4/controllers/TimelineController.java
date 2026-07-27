package br.com.w4solution.cob4.controllers;

import br.com.w4solution.cob4.dto.timeline.EventoTimelineDTO;
import br.com.w4solution.cob4.services.timeline.TimelineService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/processos/{referencia}/timeline")
public class TimelineController {
	private final TimelineService service;

	public TimelineController(TimelineService service) {
		this.service = service;
	}

	@GetMapping
	public List<EventoTimelineDTO> listar(@PathVariable String referencia) {
		return service.listar(referencia);
	}
}
