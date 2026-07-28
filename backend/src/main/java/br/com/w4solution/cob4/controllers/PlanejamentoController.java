package br.com.w4solution.cob4.controllers;

import br.com.w4solution.cob4.dto.planejamento.BacklogItemDTO;
import br.com.w4solution.cob4.dto.planejamento.FechamentoMensalDTO;
import br.com.w4solution.cob4.dto.planejamento.MetricasMensaisDTO;
import br.com.w4solution.cob4.services.planejamento.BacklogService;
import br.com.w4solution.cob4.services.planejamento.FechamentoMensalService;
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
	private final FechamentoMensalService fechamentoService;

	public PlanejamentoController(MetricasService metricasService, BacklogService backlogService,
								  FechamentoMensalService fechamentoService) {
		this.metricasService = metricasService;
		this.backlogService = backlogService;
		this.fechamentoService = fechamentoService;
	}

	@GetMapping("/metricas")
	public MetricasMensaisDTO metricas(@RequestParam(required = false) YearMonth competencia) {
		return metricasService.consultar(competencia == null ? YearMonth.now() : competencia);
	}

	@GetMapping("/backlog")
	public List<BacklogItemDTO> backlog() {
		return backlogService.listar();
	}

	@PutMapping("/backlog/{id}")
	public BacklogItemDTO atualizar(@PathVariable Long id, @Valid @RequestBody BacklogItemDTO dados) {
		return backlogService.atualizar(id, dados);
	}

	@GetMapping("/fechamentos")
	public List<FechamentoMensalDTO> fechamentos(@RequestParam YearMonth competencia) {
		return fechamentoService.listar(competencia);
	}

	@PostMapping("/fechamentos")
	public FechamentoMensalDTO gerarFechamento(@RequestParam YearMonth competencia,
											   @RequestParam(defaultValue = "Sistema") String usuario,
											   @RequestParam(required = false) String observacao) {
		return fechamentoService.gerar(competencia, usuario, observacao);
	}

	@PostMapping("/fechamentos/{id}/aprovar")
	public FechamentoMensalDTO aprovarFechamento(@PathVariable Long id) {
		return fechamentoService.aprovar(id);
	}

	@PostMapping("/fechamentos/{id}/cancelar")
	public FechamentoMensalDTO cancelarFechamento(@PathVariable Long id,
												  @RequestParam(required = false) String motivo) {
		return fechamentoService.cancelar(id, motivo);
	}
}
