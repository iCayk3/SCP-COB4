package br.com.w4solution.cob4.controllers;

import br.com.w4solution.cob4.dto.financeiro.PoliticaFinanceiraDTO;
import br.com.w4solution.cob4.security.UsuarioAtualService;
import br.com.w4solution.cob4.services.financeiro.PoliticaFinanceiraService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/configuracoes/politica-financeira")
public class PoliticaFinanceiraController {
	private final PoliticaFinanceiraService service;
	private final UsuarioAtualService usuarioAtualService;

	public PoliticaFinanceiraController(PoliticaFinanceiraService service, UsuarioAtualService usuarioAtualService) {
		this.service = service;
		this.usuarioAtualService = usuarioAtualService;
	}

	@GetMapping
	@PreAuthorize("hasAnyAuthority('SCOPE_ADMINISTRADOR','SCOPE_GERENTE','SCOPE_SUPERVISOR','SCOPE_FINANCEIRO')")
	public PoliticaFinanceiraDTO vigente() {
		return service.vigente();
	}

	@GetMapping("/historico")
	@PreAuthorize("hasAuthority('SCOPE_ADMINISTRADOR')")
	public List<PoliticaFinanceiraDTO> historico() {
		return service.historico();
	}

	@PostMapping("/publicar")
	@PreAuthorize("hasAuthority('SCOPE_ADMINISTRADOR')")
	public PoliticaFinanceiraDTO publicar(@Valid @RequestBody PoliticaFinanceiraDTO dados) {
		return service.publicar(dados, usuarioAtualService.atual().identificador());
	}
}
