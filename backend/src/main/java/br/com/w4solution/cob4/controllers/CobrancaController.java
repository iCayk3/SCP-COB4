package br.com.w4solution.cob4.controllers;

import br.com.w4solution.cob4.dto.cobranca.CobrancaResumoDTO;
import br.com.w4solution.cob4.dto.cobranca.SincronizacaoCobrancaDTO;
import br.com.w4solution.cob4.dto.cobranca.EncerrarProcessoDTO;
import br.com.w4solution.cob4.dto.cobranca.PaginaCobrancaDTO;
import br.com.w4solution.cob4.dto.cobranca.ClienteProtocolosDTO;
import br.com.w4solution.cob4.dto.cobranca.FaixaAtrasoConfigDTO;
import br.com.w4solution.cob4.dto.cobranca.ReabrirProcessoDTO;
import br.com.w4solution.cob4.services.cobranca.FaixaAtrasoConfigService;
import br.com.w4solution.cob4.services.cobranca.CobrancaService;
import br.com.w4solution.cob4.services.cobranca.ProcessoService;
import br.com.w4solution.cob4.services.cobranca.SincronizacaoRbxConfigService;
import br.com.w4solution.cob4.dto.cobranca.SincronizacaoRbxConfigDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/cobrancas")
@Tag(name = "Cobranças", description = "Cobranças agregadas por CPF a partir dos boletos vencidos do RBX")
public class CobrancaController {
	private final CobrancaService cobrancaService;
	private final ProcessoService processoService;
	private final FaixaAtrasoConfigService faixaService;
	private final SincronizacaoRbxConfigService sincronizacaoConfigService;

	public CobrancaController(CobrancaService cobrancaService, ProcessoService processoService,
							 FaixaAtrasoConfigService faixaService,
							 SincronizacaoRbxConfigService sincronizacaoConfigService) {
		this.cobrancaService = cobrancaService;
		this.processoService = processoService;
		this.faixaService = faixaService;
		this.sincronizacaoConfigService = sincronizacaoConfigService;
	}

	@PostMapping("/sincronizar-rbx")
	@Operation(summary = "Importar boletos vencidos e agregar cobranças abertas por CPF")
	public SincronizacaoCobrancaDTO sincronizarRbx() {
		return cobrancaService.sincronizarInadimplentes();
	}

	@GetMapping("/abertas")
	@Operation(summary = "Listar cobranças abertas")
	public List<CobrancaResumoDTO> listarAbertas() {
		return cobrancaService.listarAbertas();
	}

	@GetMapping("/atendimento")
	@Operation(summary = "Buscar processos para atendimento com paginação")
	public PaginaCobrancaDTO listarParaAtendimento(
			@RequestParam(defaultValue = "0") int pagina,
			@RequestParam(defaultValue = "30") int tamanho,
			@RequestParam(defaultValue = "") String busca) {
		return cobrancaService.listarParaAtendimento(pagina, tamanho, busca);
	}

	@GetMapping("/clientes/{cpf}/protocolos")
	public ClienteProtocolosDTO protocolosDoCliente(@PathVariable String cpf) {
		return cobrancaService.protocolosDoCliente(cpf);
	}

	@GetMapping("/configuracoes/faixas")
	public List<FaixaAtrasoConfigDTO> listarFaixas() {
		return faixaService.listar();
	}

	@org.springframework.web.bind.annotation.PutMapping("/configuracoes/faixas")
	public List<FaixaAtrasoConfigDTO> salvarFaixas(
			@Valid @RequestBody List<@Valid FaixaAtrasoConfigDTO> faixas) {
		return faixaService.salvar(faixas);
	}

	@GetMapping("/configuracoes/sincronizacao")
	public SincronizacaoRbxConfigDTO consultarSincronizacao() {
		return sincronizacaoConfigService.consultar();
	}

	@org.springframework.web.bind.annotation.PutMapping("/configuracoes/sincronizacao")
	public SincronizacaoRbxConfigDTO salvarSincronizacao(@Valid @RequestBody SincronizacaoRbxConfigDTO dados) {
		return sincronizacaoConfigService.salvar(dados);
	}

	@PostMapping("/{referencia}/encerrar")
	@Operation(summary = "Encerrar processo exigindo o motivo conforme RN-007")
	public void encerrar(@PathVariable String referencia, @Valid @RequestBody EncerrarProcessoDTO dados) {
		processoService.encerrar(referencia, dados);
	}

	@PostMapping("/{referencia}/reabrir")
	public void reabrir(@PathVariable String referencia, @Valid @RequestBody ReabrirProcessoDTO dados) {
		processoService.reabrir(referencia, dados);
	}
}
