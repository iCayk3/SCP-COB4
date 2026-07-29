package br.com.w4solution.cob4.controllers;

import br.com.w4solution.cob4.dto.planejamento.BacklogItemDTO;
import br.com.w4solution.cob4.dto.planejamento.FechamentoMensalDTO;
import br.com.w4solution.cob4.dto.planejamento.MetricasMensaisDTO;
import br.com.w4solution.cob4.services.planejamento.BacklogService;
import br.com.w4solution.cob4.services.planejamento.FechamentoMensalService;
import br.com.w4solution.cob4.services.planejamento.MetricasService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import br.com.w4solution.cob4.security.UsuarioAtualService;

import java.time.YearMonth;
import java.util.List;

@RestController
@RequestMapping("/api/planejamento")
@PreAuthorize("hasAnyAuthority('SCOPE_ADMINISTRADOR','SCOPE_GERENTE','SCOPE_SUPERVISOR')")
public class PlanejamentoController {
	private final MetricasService metricasService;
	private final BacklogService backlogService;
	private final FechamentoMensalService fechamentoService;
	private final UsuarioAtualService usuarioAtualService;

	public PlanejamentoController(MetricasService metricasService, BacklogService backlogService,
								  FechamentoMensalService fechamentoService,
								  UsuarioAtualService usuarioAtualService) {
		this.metricasService = metricasService;
		this.backlogService = backlogService;
		this.fechamentoService = fechamentoService;
		this.usuarioAtualService = usuarioAtualService;
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
	@PreAuthorize("hasAnyAuthority('SCOPE_ADMINISTRADOR','SCOPE_GERENTE')")
	public BacklogItemDTO atualizar(@PathVariable Long id, @Valid @RequestBody BacklogItemDTO dados) {
		return backlogService.atualizar(id, dados);
	}

	@GetMapping("/fechamentos")
	public List<FechamentoMensalDTO> fechamentos(@RequestParam YearMonth competencia) {
		return fechamentoService.listar(competencia);
	}

	@PostMapping("/fechamentos")
	@PreAuthorize("hasAnyAuthority('SCOPE_ADMINISTRADOR','SCOPE_GERENTE')")
	public FechamentoMensalDTO gerarFechamento(@RequestParam YearMonth competencia,
											   @RequestParam(required = false) String observacao) {
		return fechamentoService.gerar(competencia, usuarioAtualService.atual().identificador(), observacao);
	}

	@PostMapping("/fechamentos/{id}/aprovar")
	@PreAuthorize("hasAnyAuthority('SCOPE_ADMINISTRADOR','SCOPE_GERENTE')")
	public FechamentoMensalDTO aprovarFechamento(@PathVariable Long id) {
		return fechamentoService.aprovar(id);
	}

	@PostMapping("/fechamentos/{id}/cancelar")
	@PreAuthorize("hasAnyAuthority('SCOPE_ADMINISTRADOR','SCOPE_GERENTE')")
	public FechamentoMensalDTO cancelarFechamento(@PathVariable Long id,
												  @RequestParam(required = false) String motivo) {
		return fechamentoService.cancelar(id, motivo);
	}
}
