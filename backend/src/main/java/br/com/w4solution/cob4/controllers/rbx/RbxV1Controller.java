package br.com.w4solution.cob4.controllers.rbx;

import br.com.w4solution.cob4.dto.rbx.RbxV1Request;
import br.com.w4solution.cob4.dto.rbx.RbxV1Servico;
import br.com.w4solution.cob4.integracao.IntegracaoException;
import br.com.w4solution.cob4.services.rbx.RbxV1CatalogoService;
import br.com.w4solution.cob4.services.rbx.RbxV1GenericService;
import com.fasterxml.jackson.databind.JsonNode;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rbx/v1")
@PreAuthorize("hasAnyAuthority('SCOPE_ADMINISTRADOR','SCOPE_GERENTE')")
@Tag(name = "Fonte RBX v1", description = "Execucao e catalogo tecnico dos servicos RBX v1 usados pelo sistema")
public class RbxV1Controller {

	private final RbxV1GenericService rbxV1GenericService;
	private final RbxV1CatalogoService rbxV1CatalogoService;

	public RbxV1Controller(RbxV1GenericService rbxV1GenericService, RbxV1CatalogoService rbxV1CatalogoService) {
		this.rbxV1GenericService = rbxV1GenericService;
		this.rbxV1CatalogoService = rbxV1CatalogoService;
	}

	@GetMapping("/servicos")
	@Operation(
			summary = "Listar servicos RBX v1 catalogados",
			description = "Retorna o catalogo tecnico da fonte rbx-v1. Para a visao por funcao do sistema, veja a documentacao de funcoes de dados."
	)
	public List<RbxV1Servico> listarServicos() {
		return rbxV1CatalogoService.listar();
	}

	@GetMapping("/servicos/{servico}")
	@Operation(summary = "Consultar metadados de um servico RBX v1")
	public ResponseEntity<RbxV1Servico> buscarServico(@PathVariable String servico) {
		return rbxV1CatalogoService.buscar(servico)
				.map(ResponseEntity::ok)
				.orElseGet(() -> ResponseEntity.notFound().build());
	}

	@PostMapping
	@Operation(
			summary = "Executar servico RBX v1 no formato do provider",
			description = "Recebe um JSON com exatamente um servico na raiz. O backend injeta Autenticacao.ChaveIntegracao automaticamente."
	)
	public JsonNode executar(@RequestBody JsonNode request) {
		return rbxV1GenericService.executar(request);
	}

	@PostMapping("/{servico}")
	@Operation(
			summary = "Executar servico RBX v1 por nome",
			description = "Recebe filtro e campos livres. O backend monta o envelope RBX v1 e injeta a chave de integracao."
	)
	public JsonNode executar(@PathVariable String servico, @RequestBody(required = false) RbxV1Request request) {
		return rbxV1GenericService.executar(servico, request);
	}

	@ExceptionHandler(IntegracaoException.class)
	public ResponseEntity<Map<String, String>> tratarErroIntegracao(IntegracaoException exception) {
		return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
				.body(Map.of("erro", exception.getMessage()));
	}
}
