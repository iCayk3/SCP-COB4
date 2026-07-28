package br.com.w4solution.cob4.controllers;

import br.com.w4solution.cob4.dto.cobranca.*;
import br.com.w4solution.cob4.services.cobranca.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cobrancas")
@Tag(name = "Cobrancas", description = "Operacao de cobranca a partir dos boletos vencidos do RBX")
public class CobrancaController {
	private final CobrancaService cobrancaService;
	private final ProcessoService processoService;
	private final FaixaAtrasoConfigService faixaService;
	private final SincronizacaoRbxConfigService sincronizacaoConfigService;
	private final SincronizacaoRbxMonitorService sincronizacaoMonitorService;
	private final FilaCobrancaService filaService;
	private final PromessaPagamentoService promessaService;
	private final PagamentoService pagamentoService;

	public CobrancaController(CobrancaService cobrancaService, ProcessoService processoService,
							  FaixaAtrasoConfigService faixaService,
							  SincronizacaoRbxConfigService sincronizacaoConfigService,
							  SincronizacaoRbxMonitorService sincronizacaoMonitorService,
							  FilaCobrancaService filaService,
							  PromessaPagamentoService promessaService,
							  PagamentoService pagamentoService) {
		this.cobrancaService = cobrancaService;
		this.processoService = processoService;
		this.faixaService = faixaService;
		this.sincronizacaoConfigService = sincronizacaoConfigService;
		this.sincronizacaoMonitorService = sincronizacaoMonitorService;
		this.filaService = filaService;
		this.promessaService = promessaService;
		this.pagamentoService = pagamentoService;
	}

	@PostMapping("/sincronizar-rbx")
	@Operation(summary = "Importar boletos vencidos e agregar cobrancas abertas por contrato")
	public SincronizacaoCobrancaDTO sincronizarRbx() {
		return sincronizacaoMonitorService.sincronizar("manual");
	}

	@GetMapping("/sincronizacoes-rbx")
	public List<SincronizacaoRbxExecucaoDTO> historicoSincronizacoes() {
		return sincronizacaoMonitorService.recentes();
	}

	@GetMapping("/abertas")
	public List<CobrancaResumoDTO> listarAbertas() {
		return cobrancaService.listarAbertas();
	}

	@GetMapping("/atendimento")
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

	@GetMapping("/fila/{responsavelIdentificador}")
	public List<CobrancaResumoDTO> minhaFila(@PathVariable String responsavelIdentificador) {
		return filaService.minhaFila(responsavelIdentificador);
	}

	@PostMapping("/fila/distribuir")
	public ResultadoDistribuicaoDTO distribuir(@Valid @RequestBody DistribuicaoCarteiraDTO dados) {
		return filaService.distribuir(dados);
	}

	@GetMapping("/tarefas")
	public List<TarefaCobrancaDTO> tarefas(@RequestParam(required = false) String responsavelIdentificador) {
		return filaService.tarefas(responsavelIdentificador);
	}

	@PutMapping("/tarefas/{id}")
	public TarefaCobrancaDTO atualizarTarefa(@PathVariable Long id, @Valid @RequestBody AtualizarTarefaDTO dados) {
		return filaService.atualizarTarefa(id, dados);
	}

	@GetMapping("/configuracoes/faixas")
	public List<FaixaAtrasoConfigDTO> listarFaixas() {
		return faixaService.listar();
	}

	@PutMapping("/configuracoes/faixas")
	public List<FaixaAtrasoConfigDTO> salvarFaixas(@Valid @RequestBody List<@Valid FaixaAtrasoConfigDTO> faixas) {
		return faixaService.salvar(faixas);
	}

	@GetMapping("/configuracoes/sincronizacao")
	public SincronizacaoRbxConfigDTO consultarSincronizacao() {
		return sincronizacaoConfigService.consultar();
	}

	@PutMapping("/configuracoes/sincronizacao")
	public SincronizacaoRbxConfigDTO salvarSincronizacao(@Valid @RequestBody SincronizacaoRbxConfigDTO dados) {
		return sincronizacaoConfigService.salvar(dados);
	}

	@PostMapping("/{referencia}/encerrar")
	public void encerrar(@PathVariable String referencia, @Valid @RequestBody EncerrarProcessoDTO dados) {
		processoService.encerrar(referencia, dados);
	}

	@PostMapping("/{referencia}/reabrir")
	public void reabrir(@PathVariable String referencia, @Valid @RequestBody ReabrirProcessoDTO dados) {
		processoService.reabrir(referencia, dados);
	}

	@GetMapping("/{referencia}/promessas")
	public List<PromessaPagamentoDTO> listarPromessas(@PathVariable String referencia) {
		return promessaService.listar(referencia);
	}

	@PostMapping("/{referencia}/promessas")
	public PromessaPagamentoDTO registrarPromessa(
			@PathVariable String referencia, @Valid @RequestBody RegistrarPromessaDTO dados) {
		return promessaService.registrar(referencia, dados);
	}

	@PostMapping("/{referencia}/pagamentos")
	public void registrarPagamento(@PathVariable String referencia, @Valid @RequestBody RegistrarPagamentoDTO dados) {
		pagamentoService.registrarPagamento(referencia, dados);
	}

	@PostMapping("/{referencia}/estornos")
	public void registrarEstorno(@PathVariable String referencia, @Valid @RequestBody RegistrarPagamentoDTO dados) {
		pagamentoService.registrarEstorno(referencia, dados);
	}
}
