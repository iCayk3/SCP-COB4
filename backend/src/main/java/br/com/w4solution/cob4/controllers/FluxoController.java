package br.com.w4solution.cob4.controllers;

import br.com.w4solution.cob4.dto.fluxo.*;
import br.com.w4solution.cob4.services.fluxo.*;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

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
	@PreAuthorize("hasAnyAuthority('SCOPE_ADMINISTRADOR','SCOPE_GERENTE')")
	public FluxoDTO criar(@Valid @RequestBody FluxoDTO dados) { return fluxoService.salvar(null, dados); }

	@PutMapping("/{id}")
	@PreAuthorize("hasAnyAuthority('SCOPE_ADMINISTRADOR','SCOPE_GERENTE')")
	public FluxoDTO editar(@PathVariable Long id, @Valid @RequestBody FluxoDTO dados) {
		return fluxoService.salvar(id, dados);
	}
	@PostMapping("/{id}/publicar") @PreAuthorize("hasAnyAuthority('SCOPE_ADMINISTRADOR','SCOPE_GERENTE')")
	public FluxoDTO publicar(@PathVariable Long id){return fluxoService.publicar(id);}
	@PostMapping("/{id}/nova-versao") @PreAuthorize("hasAnyAuthority('SCOPE_ADMINISTRADOR','SCOPE_GERENTE')")
	public FluxoDTO novaVersao(@PathVariable Long id){return fluxoService.novaVersao(id);}
	@GetMapping("/{id}/validacao") @PreAuthorize("hasAnyAuthority('SCOPE_ADMINISTRADOR','SCOPE_GERENTE')")
	public ValidacaoFluxoDTO validar(@PathVariable Long id){return fluxoService.validarVersao(id);}
	@PostMapping("/{id}/desativar") @PreAuthorize("hasAnyAuthority('SCOPE_ADMINISTRADOR','SCOPE_GERENTE')")
	public FluxoDTO desativar(@PathVariable Long id){return fluxoService.desativar(id);}

	@GetMapping("/processos/{referencia}")
	@PreAuthorize("@carteiraAccess.podeAcessar(#referencia)")
	public EstadoProcessoDTO estado(@PathVariable String referencia) { return estadoService.consultar(referencia); }

	@PostMapping("/processos/{referencia}/transicoes")
	@PreAuthorize("@carteiraAccess.podeAcessar(#referencia)")
	public EstadoProcessoDTO alterar(@PathVariable String referencia, @Valid @RequestBody AlterarEstadoDTO dados) {
		return estadoService.alterar(referencia, dados);
	}

	@PostMapping("/processos/transicoes-lote")
	@PreAuthorize("hasAnyAuthority('SCOPE_ADMINISTRADOR','SCOPE_GERENTE','SCOPE_SUPERVISOR')")
	public ResultadoAlteracaoLoteDTO alterarEmLote(@Valid @RequestBody AlterarEstadoLoteDTO dados) {
		return estadoService.alterarEmLote(dados);
	}

	@PutMapping("/processos/{referencia}")
	@PreAuthorize("hasAnyAuthority('SCOPE_ADMINISTRADOR','SCOPE_GERENTE')")
	public EstadoProcessoDTO atribuir(@PathVariable String referencia, @Valid @RequestBody AtribuirFluxoDTO dados) {
		return estadoService.atribuirFluxo(referencia, dados);
	}
}
