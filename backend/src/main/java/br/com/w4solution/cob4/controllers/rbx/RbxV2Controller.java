package br.com.w4solution.cob4.controllers.rbx;

import br.com.w4solution.cob4.dto.rbx.RbxV2Servico;
import br.com.w4solution.cob4.integracao.IntegracaoException;
import br.com.w4solution.cob4.services.rbx.RbxV2CatalogoService;
import br.com.w4solution.cob4.services.rbx.RbxV2GenericService;
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
@RequestMapping("/api/rbx/v2")
@PreAuthorize("hasAnyAuthority('SCOPE_ADMINISTRADOR','SCOPE_GERENTE')")
@Tag(name = "Funcoes de dados - RBX v2", description = "Funcoes do sistema atendidas pela fonte de dados RBX v2")
public class RbxV2Controller {

	private final RbxV2GenericService rbxV2GenericService;
	private final RbxV2CatalogoService rbxV2CatalogoService;

	public RbxV2Controller(RbxV2GenericService rbxV2GenericService, RbxV2CatalogoService rbxV2CatalogoService) {
		this.rbxV2GenericService = rbxV2GenericService;
		this.rbxV2CatalogoService = rbxV2CatalogoService;
	}

	@GetMapping("/funcoes")
	@Operation(
			summary = "Listar funcoes de dados disponiveis na fonte RBX v2",
			description = "Retorna funcoes pelo nome do nosso sistema, com o servico tecnico RBX v2 usado como provider atual."
	)
	public List<RbxV2Servico> listarFuncoes() {
		return rbxV2CatalogoService.listar();
	}

	@GetMapping("/funcoes/provider/{servicoProvider}")
	@Operation(summary = "Consultar funcao pelo nome tecnico do provider RBX v2")
	public ResponseEntity<RbxV2Servico> buscarPorServicoProvider(@PathVariable String servicoProvider) {
		return rbxV2CatalogoService.buscarPorServicoProvider(servicoProvider)
				.map(ResponseEntity::ok)
				.orElseGet(() -> ResponseEntity.notFound().build());
	}

	@GetMapping("/funcoes/sistema/{funcaoSistema}")
	@Operation(summary = "Consultar funcao pelo nome funcional do nosso sistema")
	public ResponseEntity<RbxV2Servico> buscarPorFuncaoSistema(@PathVariable String funcaoSistema) {
		return rbxV2CatalogoService.buscarPorFuncaoSistema(funcaoSistema)
				.map(ResponseEntity::ok)
				.orElseGet(() -> ResponseEntity.notFound().build());
	}

	@PostMapping
	@Operation(
			summary = "Executar funcao RBX v2 no formato do provider",
			description = "Recebe um JSON com exatamente um servico RBX v2 na raiz. O backend injeta o header authentication_key automaticamente."
	)
	public JsonNode executar(@RequestBody JsonNode request) {
		return rbxV2GenericService.executar(request);
	}

	@PostMapping("/{servico}")
	@Operation(
			summary = "Executar servico RBX v2 por nome tecnico",
			description = "Recebe o payload do servico e monta o envelope esperado pela RBX v2. Use GET /api/rbx/v2/funcoes para descobrir a funcao do sistema correspondente."
	)
	public JsonNode executar(@PathVariable String servico, @RequestBody(required = false) JsonNode payload) {
		return rbxV2GenericService.executar(servico, payload);
	}

	@ExceptionHandler(IntegracaoException.class)
	public ResponseEntity<Map<String, String>> tratarErroIntegracao(IntegracaoException exception) {
		return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
				.body(Map.of("erro", exception.getMessage()));
	}
}
