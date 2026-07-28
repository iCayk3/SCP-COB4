package br.com.w4solution.cob4.controllers;

import br.com.w4solution.cob4.dto.planejamento.BacklogItemDTO;
import br.com.w4solution.cob4.dto.planejamento.MetricasMensaisDTO;
import br.com.w4solution.cob4.services.planejamento.BacklogService;
import br.com.w4solution.cob4.services.planejamento.MetricasService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.time.YearMonth;
import java.util.List;

@RestController
@RequestMapping("/api/planejamento")
public class PlanejamentoController {
	private final MetricasService metricasService;
	private final BacklogService backlogService;
	public PlanejamentoController(MetricasService metricasService, BacklogService backlogService) {
		this.metricasService = metricasService; this.backlogService = backlogService;
	}

	@GetMapping("/metricas")
	public MetricasMensaisDTO metricas(@RequestParam(required = false) YearMonth competencia) {
		return metricasService.consultar(competencia == null ? YearMonth.now() : competencia);
	}

	@GetMapping("/backlog")
	public List<BacklogItemDTO> backlog() { return backlogService.listar(); }

	@PutMapping("/backlog/{id}")
	public BacklogItemDTO atualizar(@PathVariable Long id, @Valid @RequestBody BacklogItemDTO dados) {
		return backlogService.atualizar(id, dados);
	}
}
