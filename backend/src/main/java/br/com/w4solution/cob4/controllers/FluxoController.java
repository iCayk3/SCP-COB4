package br.com.w4solution.cob4.controllers;

import br.com.w4solution.cob4.dto.fluxo.*;
import br.com.w4solution.cob4.services.fluxo.*;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fluxos")
public class FluxoController {
	private final FluxoService fluxoService;
	private final EstadoProcessoService estadoService;

	public FluxoController(FluxoService fluxoService, EstadoProcessoService estadoService) {
		this.fluxoService = fluxoService; this.estadoService = estadoService;
	}

	@GetMapping
	public List<FluxoDTO> listar() { return fluxoService.listar(); }

	@PostMapping
	public FluxoDTO criar(@Valid @RequestBody FluxoDTO dados) { return fluxoService.salvar(null, dados); }

	@PutMapping("/{id}")
	public FluxoDTO editar(@PathVariable Long id, @Valid @RequestBody FluxoDTO dados) {
		return fluxoService.salvar(id, dados);
	}

	@GetMapping("/processos/{referencia}")
	public EstadoProcessoDTO estado(@PathVariable String referencia) { return estadoService.consultar(referencia); }

	@PostMapping("/processos/{referencia}/transicoes")
	public EstadoProcessoDTO alterar(@PathVariable String referencia, @Valid @RequestBody AlterarEstadoDTO dados) {
		return estadoService.alterar(referencia, dados);
	}

	@PostMapping("/processos/transicoes-lote")
	public ResultadoAlteracaoLoteDTO alterarEmLote(@Valid @RequestBody AlterarEstadoLoteDTO dados) {
		return estadoService.alterarEmLote(dados);
	}

	@PutMapping("/processos/{referencia}")
	public EstadoProcessoDTO atribuir(@PathVariable String referencia, @Valid @RequestBody AtribuirFluxoDTO dados) {
		return estadoService.atribuirFluxo(referencia, dados);
	}
}
