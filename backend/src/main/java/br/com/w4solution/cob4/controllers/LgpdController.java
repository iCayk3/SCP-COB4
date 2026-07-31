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
import br.com.w4solution.cob4.dto.lgpd.IncidenteDTO;
import br.com.w4solution.cob4.services.lgpd.IncidenteSegurancaService;
import br.com.w4solution.cob4.services.lgpd.RetencaoService;
import br.com.w4solution.cob4.domain.ExecucaoRetencao;

@RestController
@RequestMapping("/api/lgpd")
public class LgpdController {
	private final PoliticaLgpdService service;
	private final PrivacidadeService privacidadeService;
	private final IncidenteSegurancaService incidentes; private final RetencaoService retencao;
	public LgpdController(PoliticaLgpdService service, PrivacidadeService privacidadeService, IncidenteSegurancaService incidentes, RetencaoService retencao) {
		this.service = service; this.privacidadeService = privacidadeService; this.incidentes=incidentes; this.retencao=retencao;
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
	@GetMapping("/incidentes") @PreAuthorize("hasAnyAuthority('SCOPE_ADMINISTRADOR','SCOPE_GERENTE')")
	public List<IncidenteDTO> incidentes(){return incidentes.listar();}
	@PostMapping("/incidentes") @PreAuthorize("hasAnyAuthority('SCOPE_ADMINISTRADOR','SCOPE_GERENTE')")
	public IncidenteDTO criarIncidente(@Valid @RequestBody IncidenteDTO d){return incidentes.criar(d);}
	@PutMapping("/incidentes/{id}") @PreAuthorize("hasAnyAuthority('SCOPE_ADMINISTRADOR','SCOPE_GERENTE')")
	public IncidenteDTO atualizarIncidente(@PathVariable Long id,@Valid @RequestBody IncidenteDTO d){return incidentes.atualizar(id,d);}
	@GetMapping("/retencao/execucoes") @PreAuthorize("hasAnyAuthority('SCOPE_ADMINISTRADOR','SCOPE_GERENTE')")
	public List<ExecucaoRetencao> execucoes(){return retencao.historico();}
	@PostMapping("/retencao/executar") @PreAuthorize("hasAnyAuthority('SCOPE_ADMINISTRADOR','SCOPE_GERENTE')")
	public ExecucaoRetencao executarRetencao(@RequestParam(defaultValue="true") boolean simulacao){return retencao.executar(simulacao);}
}
