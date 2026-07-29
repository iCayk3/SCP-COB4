package br.com.w4solution.cob4.controllers;

import br.com.w4solution.cob4.dto.atendimento.AtendimentoResumoDTO;
import br.com.w4solution.cob4.dto.atendimento.RegistrarAtendimentoDTO;
import br.com.w4solution.cob4.services.atendimento.AtendimentoService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/api/processos/{referencia}/atendimentos")
public class AtendimentoController {
	private final AtendimentoService service;

	public AtendimentoController(AtendimentoService service) {
		this.service = service;
	}

	@PostMapping
	@PreAuthorize("@carteiraAccess.podeAcessar(#referencia)")
	public AtendimentoResumoDTO registrar(@PathVariable String referencia,
										  @Valid @RequestBody RegistrarAtendimentoDTO dados) {
		return service.registrar(referencia, dados);
	}

	@GetMapping
	@PreAuthorize("@carteiraAccess.podeAcessar(#referencia)")
	public List<AtendimentoResumoDTO> listar(@PathVariable String referencia) {
		return service.listar(referencia);
	}
}
