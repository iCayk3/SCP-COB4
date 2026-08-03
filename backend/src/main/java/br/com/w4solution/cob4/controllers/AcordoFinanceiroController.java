package br.com.w4solution.cob4.controllers;
import br.com.w4solution.cob4.dto.financeiro.*;
import br.com.w4solution.cob4.services.financeiro.AcordoFinanceiroService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import br.com.w4solution.cob4.dto.api.PaginaDTO;

@RestController @RequestMapping("/api/financeiro/acordos")
public class AcordoFinanceiroController {
	private final AcordoFinanceiroService service;
	public AcordoFinanceiroController(AcordoFinanceiroService service) { this.service = service; }
	@PostMapping("/simular") @PreAuthorize("isAuthenticated()")
	public AcordoFinanceiroDTO simular(@Valid @RequestBody CriarAcordoDTO dados) { return service.simular(dados); }
	@PostMapping @PreAuthorize("isAuthenticated()")
	public AcordoFinanceiroDTO criar(@Valid @RequestBody CriarAcordoDTO dados) { return service.criar(dados); }
	@GetMapping @PreAuthorize("@carteiraAccess.podeAcessar(#cobrancaReferencia)")
	public List<AcordoFinanceiroDTO> listar(@RequestParam String cobrancaReferencia) { return service.listar(cobrancaReferencia); }
	@GetMapping("/pagina") @PreAuthorize("@carteiraAccess.podeAcessar(#cobrancaReferencia)")
	public PaginaDTO<AcordoFinanceiroDTO> listarPagina(@RequestParam String cobrancaReferencia,
			@RequestParam(defaultValue="0") int pagina, @RequestParam(defaultValue="20") int tamanho) {
		return service.listarPagina(cobrancaReferencia, pagina, Math.min(Math.max(tamanho, 1), 100));
	}
	@PostMapping("/{protocolo}/aprovar") @PreAuthorize("hasAnyAuthority('SCOPE_SUPERVISOR','SCOPE_GERENTE','SCOPE_ADMINISTRADOR')")
	public AcordoFinanceiroDTO aprovar(@PathVariable String protocolo, @RequestParam(defaultValue = "Aprovado") String motivo) { return service.decidir(protocolo, true, motivo); }
	@PostMapping("/{protocolo}/rejeitar") @PreAuthorize("hasAnyAuthority('SCOPE_SUPERVISOR','SCOPE_GERENTE','SCOPE_ADMINISTRADOR')")
	public AcordoFinanceiroDTO rejeitar(@PathVariable String protocolo, @RequestParam String motivo) { return service.decidir(protocolo, false, motivo); }
	@PostMapping("/{protocolo}/ativar") @PreAuthorize("isAuthenticated()")
	public AcordoFinanceiroDTO ativar(@PathVariable String protocolo) { return service.ativar(protocolo); }
}
