package br.com.w4solution.cob4.controllers;
import br.com.w4solution.cob4.dto.financeiro.*;import br.com.w4solution.cob4.services.financeiro.FinanceiroPagamentoService;
import jakarta.validation.Valid;import org.springframework.security.access.prepost.PreAuthorize;import org.springframework.web.bind.annotation.*;import java.util.List;
import br.com.w4solution.cob4.dto.api.PaginaDTO;
@RestController @RequestMapping("/api/financeiro/pagamentos") public class PagamentoFinanceiroController{
	private final FinanceiroPagamentoService service;public PagamentoFinanceiroController(FinanceiroPagamentoService s){service=s;}
	@PostMapping @PreAuthorize("isAuthenticated()") public PagamentoFinanceiroDTO registrar(@Valid @RequestBody RegistrarPagamentoFinanceiroDTO d){return service.registrar(d);}
	@PostMapping("/{id}/confirmar") @PreAuthorize("hasAnyAuthority('SCOPE_FINANCEIRO','SCOPE_GERENTE','SCOPE_ADMINISTRADOR')") public PagamentoFinanceiroDTO confirmar(@PathVariable Long id){return service.confirmar(id);}
	@PostMapping("/{id}/estornar") @PreAuthorize("hasAnyAuthority('SCOPE_FINANCEIRO','SCOPE_GERENTE','SCOPE_ADMINISTRADOR')") public PagamentoFinanceiroDTO estornar(@PathVariable Long id,@RequestParam String motivo){return service.estornar(id,motivo);}
	@GetMapping @PreAuthorize("@carteiraAccess.podeAcessar(#cobrancaReferencia)") public List<PagamentoFinanceiroDTO> listar(@RequestParam String cobrancaReferencia){return service.listar(cobrancaReferencia);}
	@GetMapping("/pagina") @PreAuthorize("@carteiraAccess.podeAcessar(#cobrancaReferencia)") public PaginaDTO<PagamentoFinanceiroDTO> listarPagina(@RequestParam String cobrancaReferencia,@RequestParam(defaultValue="0") int pagina,@RequestParam(defaultValue="20") int tamanho){return service.listarPagina(cobrancaReferencia,pagina,Math.min(Math.max(tamanho,1),100));}
}
