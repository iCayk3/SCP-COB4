package br.com.w4solution.cob4.controllers;

import br.com.w4solution.cob4.dto.cobranca.ClienteVisao360DTO;
import br.com.w4solution.cob4.dto.cobranca.ProcessoDetalheDTO;
import br.com.w4solution.cob4.services.cobranca.ProcessoConsultaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@Tag(name = "Processo 360", description = "Contratos agregados para as telas operacionais")
public class ProcessoConsultaController {
	private final ProcessoConsultaService service;
	public ProcessoConsultaController(ProcessoConsultaService service) { this.service = service; }

	@GetMapping("/processos/{referencia}")
	@PreAuthorize("@carteiraAccess.podeAcessar(#referencia)")
	@Operation(summary = "Consultar detalhe agregado e acoes permitidas do processo")
	@ApiResponse(responseCode = "404", description = "Processo nao encontrado",
			content = @Content(schema = @Schema(ref = "#/components/schemas/ErroApiDTO")))
	@ApiResponse(responseCode = "403", description = "Processo fora da carteira",
			content = @Content(schema = @Schema(ref = "#/components/schemas/ErroApiDTO")))
	public ProcessoDetalheDTO consultar(@PathVariable String referencia) { return service.consultar(referencia); }

	@GetMapping("/clientes/{cpf}/visao-360")
	@PreAuthorize("@carteiraAccess.podeAcessarCliente(#cpf)")
	@Operation(summary = "Consultar todos os processos de um cliente")
	public ClienteVisao360DTO cliente(@PathVariable String cpf) { return service.cliente(cpf); }
}
