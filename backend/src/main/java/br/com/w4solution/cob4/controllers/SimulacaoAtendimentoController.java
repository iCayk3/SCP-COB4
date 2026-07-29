package br.com.w4solution.cob4.controllers;

import br.com.w4solution.cob4.dto.atendimento.SimulacaoAtendimentoDTO;
import br.com.w4solution.cob4.services.atendimento.SimulacaoAtendimentoService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/atendimentos/simulacoes")
@PreAuthorize("hasAnyAuthority('SCOPE_ADMINISTRADOR','SCOPE_GERENTE')")
public class SimulacaoAtendimentoController {
	private final SimulacaoAtendimentoService service;

	public SimulacaoAtendimentoController(SimulacaoAtendimentoService service) {
		this.service = service;
	}

	@PostMapping
	public SimulacaoAtendimentoDTO gerar() {
		return service.gerar();
	}
}
