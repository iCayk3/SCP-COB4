package br.com.w4solution.cob4.controllers;

import br.com.w4solution.cob4.dto.lgpd.PoliticaLgpdDTO;
import br.com.w4solution.cob4.services.lgpd.PoliticaLgpdService;
import br.com.w4solution.cob4.services.lgpd.PrivacidadeService;
import br.com.w4solution.cob4.dto.lgpd.ExportacaoTitularDTO;
import br.com.w4solution.cob4.dto.lgpd.SolicitacaoPrivacidadeDTO;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/api/lgpd")
public class LgpdController {
	private final PoliticaLgpdService service;
	private final PrivacidadeService privacidadeService;
	public LgpdController(PoliticaLgpdService service, PrivacidadeService privacidadeService) {
		this.service = service; this.privacidadeService = privacidadeService;
	}
	@GetMapping("/politicas")
	public List<PoliticaLgpdDTO> listar() { return service.listar(); }
	@PutMapping("/politicas/{id}")
	@PreAuthorize("hasAnyAuthority('SCOPE_ADMINISTRADOR','SCOPE_GERENTE')")
	public PoliticaLgpdDTO atualizar(@PathVariable Long id, @Valid @RequestBody PoliticaLgpdDTO dados) {
		return service.atualizar(id, dados);
	}
	@PostMapping("/titulares/exportar")
	@PreAuthorize("hasAnyAuthority('SCOPE_ADMINISTRADOR','SCOPE_GERENTE')")
	public ExportacaoTitularDTO exportar(@Valid @RequestBody SolicitacaoPrivacidadeDTO dados) {
		return privacidadeService.exportar(dados);
	}
	@PostMapping("/titulares/anonimizar")
	@PreAuthorize("hasAnyAuthority('SCOPE_ADMINISTRADOR','SCOPE_GERENTE')")
	public String anonimizar(@Valid @RequestBody SolicitacaoPrivacidadeDTO dados) {
		return privacidadeService.anonimizar(dados);
	}
}
