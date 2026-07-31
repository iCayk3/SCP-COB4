package br.com.w4solution.cob4.controllers;
import br.com.w4solution.cob4.dto.financeiro.ConciliacaoFinanceiraDTO;import br.com.w4solution.cob4.services.financeiro.ConciliacaoFinanceiraService;
import org.springframework.security.access.prepost.PreAuthorize;import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/financeiro/conciliacao") public class ConciliacaoFinanceiraController{
	private final ConciliacaoFinanceiraService service;public ConciliacaoFinanceiraController(ConciliacaoFinanceiraService s){service=s;}
	@PostMapping @PreAuthorize("hasAnyAuthority('SCOPE_FINANCEIRO','SCOPE_SUPERVISOR','SCOPE_GERENTE','SCOPE_ADMINISTRADOR')") public ConciliacaoFinanceiraDTO executar(){return service.executar();}
}
