package br.com.w4solution.cob4.controllers;

import br.com.w4solution.cob4.dto.cobranca.*;
import br.com.w4solution.cob4.services.cobranca.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import br.com.w4solution.cob4.security.UsuarioAtualService;

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
	private final GestaoSlaService gestaoSlaService;
	private final UsuarioAtualService usuarioAtualService;

	public CobrancaController(CobrancaService cobrancaService, ProcessoService processoService,
							  FaixaAtrasoConfigService faixaService,
							  SincronizacaoRbxConfigService sincronizacaoConfigService,
							  SincronizacaoRbxMonitorService sincronizacaoMonitorService,
							  FilaCobrancaService filaService,
							  PromessaPagamentoService promessaService,
							  PagamentoService pagamentoService,
							  GestaoSlaService gestaoSlaService,
							  UsuarioAtualService usuarioAtualService) {
		this.cobrancaService = cobrancaService;
		this.processoService = processoService;
		this.faixaService = faixaService;
		this.sincronizacaoConfigService = sincronizacaoConfigService;
		this.sincronizacaoMonitorService = sincronizacaoMonitorService;
		this.filaService = filaService;
		this.promessaService = promessaService;
		this.pagamentoService = pagamentoService;
		this.gestaoSlaService = gestaoSlaService;
		this.usuarioAtualService = usuarioAtualService;
	}

	@PostMapping("/sincronizar-rbx")
	@PreAuthorize("hasAnyAuthority('SCOPE_ADMINISTRADOR','SCOPE_GERENTE')")
	@Operation(summary = "Importar boletos vencidos e agregar cobrancas abertas por contrato")
	public SincronizacaoCobrancaDTO sincronizarRbx(
			@RequestHeader(name = "Idempotency-Key", required = false) String chaveIdempotencia) {
		return sincronizacaoMonitorService.sincronizar("manual", chaveIdempotencia);
	}

	@GetMapping("/sincronizacoes-rbx")
	@PreAuthorize("hasAnyAuthority('SCOPE_ADMINISTRADOR','SCOPE_GERENTE','SCOPE_SUPERVISOR')")
	public List<SincronizacaoRbxExecucaoDTO> historicoSincronizacoes() {
		return sincronizacaoMonitorService.recentes();
	}

	@GetMapping("/sincronizacoes-rbx/falhas")
	@PreAuthorize("hasAnyAuthority('SCOPE_ADMINISTRADOR','SCOPE_GERENTE')")
	public List<FalhaSincronizacaoRbxDTO> falhasSincronizacoes() {
		return sincronizacaoMonitorService.falhas();
	}

	@PostMapping("/sincronizacoes-rbx/falhas/{id}/reprocessar")
	@PreAuthorize("hasAnyAuthority('SCOPE_ADMINISTRADOR','SCOPE_GERENTE')")
	public SincronizacaoCobrancaDTO reprocessarFalha(@PathVariable Long id) {
		return sincronizacaoMonitorService.reprocessar(id);
	}

	@PostMapping("/sincronizacoes-rbx/reconciliar")
	@PreAuthorize("hasAnyAuthority('SCOPE_ADMINISTRADOR','SCOPE_GERENTE')")
	@Operation(summary = "Reconciliar o estado local com a fotografia atual do RBX")
	public ReconciliacaoRbxDTO reconciliarRbx(
			@RequestHeader(name = "Idempotency-Key", required = false) String chaveIdempotencia) {
		return sincronizacaoMonitorService.reconciliar(chaveIdempotencia);
	}

	@GetMapping("/abertas")
	@PreAuthorize("hasAnyAuthority('SCOPE_ADMINISTRADOR','SCOPE_GERENTE','SCOPE_SUPERVISOR')")
	public List<CobrancaResumoDTO> listarAbertas() {
		return cobrancaService.listarAbertas();
	}

	@GetMapping("/atendimento")
	@PreAuthorize("hasAnyAuthority('SCOPE_ADMINISTRADOR','SCOPE_GERENTE','SCOPE_SUPERVISOR')")
	public PaginaCobrancaDTO listarParaAtendimento(
			@RequestParam(defaultValue = "0") int pagina,
			@RequestParam(defaultValue = "30") int tamanho,
			@RequestParam(defaultValue = "") String busca) {
		return cobrancaService.listarParaAtendimento(pagina, tamanho, busca);
	}

	@GetMapping("/clientes/{cpf}/protocolos")
	@PreAuthorize("hasAnyAuthority('SCOPE_ADMINISTRADOR','SCOPE_GERENTE','SCOPE_SUPERVISOR')")
	public ClienteProtocolosDTO protocolosDoCliente(@PathVariable String cpf) {
		return cobrancaService.protocolosDoCliente(cpf);
	}

	@GetMapping("/fila/{responsavelIdentificador}")
	public List<CobrancaResumoDTO> minhaFila(@PathVariable String responsavelIdentificador) {
		return filaService.minhaFila(responsavelIdentificador);
	}

	@PostMapping("/fila/distribuir")
	@PreAuthorize("hasAnyAuthority('SCOPE_ADMINISTRADOR','SCOPE_GERENTE','SCOPE_SUPERVISOR')")
	public ResultadoDistribuicaoDTO distribuir(@Valid @RequestBody DistribuicaoCarteiraDTO dados) {
		return filaService.distribuir(dados);
	}

	@PostMapping("/fila/{referencia}/redistribuir")
	@PreAuthorize("hasAnyAuthority('SCOPE_ADMINISTRADOR','SCOPE_GERENTE','SCOPE_SUPERVISOR')")
	public ResultadoDistribuicaoDTO.ItemDTO redistribuir(@PathVariable String referencia,
			@Valid @RequestBody RedistribuirCarteiraDTO dados) {
		return filaService.redistribuir(referencia, dados);
	}

	@GetMapping("/tarefas")
	public List<TarefaCobrancaDTO> tarefas(@RequestParam(required = false) String responsavelIdentificador) {
		return filaService.tarefas(responsavelIdentificador);
	}

	@PutMapping("/tarefas/{id}")
	public TarefaCobrancaDTO atualizarTarefa(@PathVariable Long id, @Valid @RequestBody AtualizarTarefaDTO dados) {
		return filaService.atualizarTarefa(id, dados);
	}

	@PostMapping("/{referencia}/sla/pausar")
	@PreAuthorize("hasAnyAuthority('SCOPE_ADMINISTRADOR','SCOPE_GERENTE','SCOPE_SUPERVISOR')")
	public void pausarSla(@PathVariable String referencia, @Valid @RequestBody PausaSlaDTO dados) {
		var usuario = usuarioAtualService.atual();
		gestaoSlaService.pausar(referencia, dados.motivo(), usuario.nome(), usuario.identificador());
	}

	@PostMapping("/{referencia}/sla/retomar")
	@PreAuthorize("hasAnyAuthority('SCOPE_ADMINISTRADOR','SCOPE_GERENTE','SCOPE_SUPERVISOR')")
	public void retomarSla(@PathVariable String referencia, @Valid @RequestBody PausaSlaDTO dados) {
		var usuario = usuarioAtualService.atual();
		gestaoSlaService.retomar(referencia, dados.motivo(), usuario.nome(), usuario.identificador());
	}

	@GetMapping("/configuracoes/faixas")
	@PreAuthorize("hasAnyAuthority('SCOPE_ADMINISTRADOR','SCOPE_GERENTE','SCOPE_SUPERVISOR')")
	public List<FaixaAtrasoConfigDTO> listarFaixas() {
		return faixaService.listar();
	}

	@PutMapping("/configuracoes/faixas")
	@PreAuthorize("hasAnyAuthority('SCOPE_ADMINISTRADOR','SCOPE_GERENTE')")
	public List<FaixaAtrasoConfigDTO> salvarFaixas(@Valid @RequestBody List<@Valid FaixaAtrasoConfigDTO> faixas) {
		return faixaService.salvar(faixas);
	}

	@GetMapping("/configuracoes/sincronizacao")
	@PreAuthorize("hasAnyAuthority('SCOPE_ADMINISTRADOR','SCOPE_GERENTE')")
	public SincronizacaoRbxConfigDTO consultarSincronizacao() {
		return sincronizacaoConfigService.consultar();
	}

	@PutMapping("/configuracoes/sincronizacao")
	@PreAuthorize("hasAnyAuthority('SCOPE_ADMINISTRADOR','SCOPE_GERENTE')")
	public SincronizacaoRbxConfigDTO salvarSincronizacao(@Valid @RequestBody SincronizacaoRbxConfigDTO dados) {
		return sincronizacaoConfigService.salvar(dados);
	}

	@PostMapping("/{referencia}/encerrar")
	@PreAuthorize("hasAnyAuthority('SCOPE_ADMINISTRADOR','SCOPE_GERENTE','SCOPE_SUPERVISOR')")
	public void encerrar(@PathVariable String referencia, @Valid @RequestBody EncerrarProcessoDTO dados) {
		processoService.encerrar(referencia, dados);
	}

	@PostMapping("/{referencia}/reabrir")
	@PreAuthorize("hasAnyAuthority('SCOPE_ADMINISTRADOR','SCOPE_GERENTE','SCOPE_SUPERVISOR')")
	public void reabrir(@PathVariable String referencia, @Valid @RequestBody ReabrirProcessoDTO dados) {
		processoService.reabrir(referencia, dados);
	}

	@GetMapping("/{referencia}/promessas")
	@PreAuthorize("@carteiraAccess.podeAcessar(#referencia)")
	public List<PromessaPagamentoDTO> listarPromessas(@PathVariable String referencia) {
		return promessaService.listar(referencia);
	}

	@PostMapping("/{referencia}/promessas")
	@PreAuthorize("@carteiraAccess.podeAcessar(#referencia)")
	public PromessaPagamentoDTO registrarPromessa(
			@PathVariable String referencia, @Valid @RequestBody RegistrarPromessaDTO dados) {
		return promessaService.registrar(referencia, dados);
	}

	@PostMapping("/{referencia}/pagamentos")
	@PreAuthorize("hasAnyAuthority('SCOPE_ADMINISTRADOR','SCOPE_GERENTE','SCOPE_FINANCEIRO')")
	public void registrarPagamento(@PathVariable String referencia, @Valid @RequestBody RegistrarPagamentoDTO dados) {
		pagamentoService.registrarPagamento(referencia, dados);
	}

	@PostMapping("/{referencia}/estornos")
	@PreAuthorize("hasAnyAuthority('SCOPE_ADMINISTRADOR','SCOPE_GERENTE','SCOPE_FINANCEIRO')")
	public void registrarEstorno(@PathVariable String referencia, @Valid @RequestBody RegistrarPagamentoDTO dados) {
		pagamentoService.registrarEstorno(referencia, dados);
	}
}
