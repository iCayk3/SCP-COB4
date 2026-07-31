package br.com.w4solution.cob4.services.cobranca;

import br.com.w4solution.cob4.domain.SincronizacaoRbxExecucao;
import br.com.w4solution.cob4.dto.cobranca.SincronizacaoCobrancaDTO;
import br.com.w4solution.cob4.dto.cobranca.FalhaSincronizacaoRbxDTO;
import br.com.w4solution.cob4.dto.cobranca.SincronizacaoRbxExecucaoDTO;
import br.com.w4solution.cob4.dto.cobranca.ReconciliacaoRbxDTO;
import br.com.w4solution.cob4.repositories.SincronizacaoRbxExecucaoRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Value;

import java.time.Duration;
import java.time.OffsetDateTime;
import java.util.List;

@Service
public class SincronizacaoRbxMonitorService {
	private final CobrancaService cobrancaService;
	private final SincronizacaoRbxExecucaoRepository repository;
	private final FilaFalhasRbxService filaFalhas;
	private final ObjectMapper objectMapper;
	@Value("${sgc.rbx.retry.max-tentativas:3}")
	private int maxTentativas = 3;
	@Value("${sgc.rbx.retry.backoff-inicial-ms:250}")
	private long backoffInicialMs = 250;
	@Value("${sgc.rbx.retry.backoff-max-ms:300000}")
	private long backoffMaxMs = 300000;

	public SincronizacaoRbxMonitorService(CobrancaService cobrancaService,
										  SincronizacaoRbxExecucaoRepository repository,
										  FilaFalhasRbxService filaFalhas, ObjectMapper objectMapper) {
		this.cobrancaService = cobrancaService;
		this.repository = repository;
		this.filaFalhas = filaFalhas;
		this.objectMapper = objectMapper;
	}

	public SincronizacaoCobrancaDTO sincronizar(String origem) {
		return sincronizar(origem, null);
	}

	public SincronizacaoCobrancaDTO sincronizar(String origem, String chaveIdempotencia) {
		return repetido(chaveIdempotencia, SincronizacaoCobrancaDTO.class)
				.orElseGet(() -> executarComRetry(origem, chaveIdempotencia, true));
	}

	public ReconciliacaoRbxDTO reconciliar(String chaveIdempotencia) {
		return repetido(chaveIdempotencia, ReconciliacaoRbxDTO.class).orElseGet(() -> {
			OffsetDateTime inicio = OffsetDateTime.now();
			RuntimeException ultimaFalha = null;
			for (int tentativa = 1; tentativa <= Math.max(1, maxTentativas); tentativa++) {
				try {
					ReconciliacaoRbxDTO resultado = cobrancaService.reconciliarInadimplentes();
					registrar("reconciliacao", chaveIdempotencia, inicio, SincronizacaoRbxExecucao.Status.SUCESSO,
							resultado.sincronizacao(), resultado,
							"Reconciliacao concluida na tentativa " + tentativa);
					return resultado;
				} catch (RuntimeException erro) {
					ultimaFalha = erro;
					if (tentativa < maxTentativas) aguardar(backoff(tentativa));
				}
			}
			registrar("reconciliacao", chaveIdempotencia, inicio, SincronizacaoRbxExecucao.Status.FALHA,
					null, null, ultimaFalha.getMessage());
			filaFalhas.enfileirar("reconciliacao", ultimaFalha);
			throw ultimaFalha;
		});
	}

	public SincronizacaoCobrancaDTO reprocessar(Long falhaId) {
		var falha = filaFalhas.preparar(falhaId, true);
		try {
			var resultado = executarComRetry("reprocessamento:" + falha.getId(), null, false);
			filaFalhas.resolver(falha.getId());
			return resultado;
		} catch (RuntimeException erro) {
			filaFalhas.reagendar(falha.getId(), erro);
			throw erro;
		}
	}

	private SincronizacaoCobrancaDTO executarComRetry(String origem, String chaveIdempotencia, boolean enfileirar) {
		OffsetDateTime inicio = OffsetDateTime.now();
		RuntimeException ultimaFalha = null;
		for (int tentativa = 1; tentativa <= Math.max(1, maxTentativas); tentativa++) {
			try {
				SincronizacaoCobrancaDTO resultado = cobrancaService.sincronizarInadimplentes();
				registrar(origem, chaveIdempotencia, inicio, SincronizacaoRbxExecucao.Status.SUCESSO,
						resultado, resultado, "Sincronizacao concluida na tentativa " + tentativa);
				return resultado;
			} catch (RuntimeException erro) {
				ultimaFalha = erro;
				if (tentativa < maxTentativas) aguardar(backoff(tentativa));
			}
		}
		registrar(origem, chaveIdempotencia, inicio, SincronizacaoRbxExecucao.Status.FALHA,
				null, null, ultimaFalha.getMessage());
		if (enfileirar) filaFalhas.enfileirar(origem, ultimaFalha);
		throw ultimaFalha;
	}

	long backoff(int tentativa) {
		return Math.min(backoffMaxMs, backoffInicialMs * (1L << Math.min(20, Math.max(0, tentativa - 1))));
	}

	void aguardar(long millis) {
		try {
			Thread.sleep(millis);
		} catch (InterruptedException interrompida) {
			Thread.currentThread().interrupt();
			throw new IllegalStateException("Retry RBX interrompido", interrompida);
		}
	}

	@Transactional(readOnly = true)
	public List<SincronizacaoRbxExecucaoDTO> recentes() {
		return repository.findTop20ByOrderByIniciadaEmDesc().stream().map(this::dto).toList();
	}

	public List<FalhaSincronizacaoRbxDTO> falhas() {
		return filaFalhas.listar();
	}

	private void registrar(String origem, String chaveIdempotencia, OffsetDateTime inicio,
						   SincronizacaoRbxExecucao.Status status, SincronizacaoCobrancaDTO contadores,
						   Object resultado, String mensagem) {
		OffsetDateTime fim = OffsetDateTime.now();
		SincronizacaoRbxExecucao execucao = new SincronizacaoRbxExecucao();
		execucao.setChaveIdempotencia(normalizarChave(chaveIdempotencia));
		execucao.setOrigem(origem == null || origem.isBlank() ? "manual" : origem.trim());
		execucao.setStatus(status);
		execucao.setIniciadaEm(inicio);
		execucao.setFinalizadaEm(fim);
		execucao.setDuracaoMs(Duration.between(inicio, fim).toMillis());
		if (contadores != null) {
			execucao.setDocumentosRecebidos(contadores.documentosRecebidos());
			execucao.setVencidos(contadores.documentosVencidos());
			execucao.setCobrancasCriadas(contadores.cobrancasCriadas());
			execucao.setBoletosCriados(contadores.boletosCriados());
		}
		if (resultado != null) try { execucao.setResultadoJson(objectMapper.writeValueAsString(resultado)); }
		catch (JsonProcessingException erro) { throw new IllegalStateException("Falha ao persistir resultado RBX", erro); }
		execucao.setMensagem(mensagem == null ? null : mensagem.substring(0, Math.min(2000, mensagem.length())));
		repository.save(execucao);
	}

	private <T> java.util.Optional<T> repetido(String chave, Class<T> tipo) {
		String normalizada = normalizarChave(chave);
		if (normalizada == null) return java.util.Optional.empty();
		return repository.findFirstByChaveIdempotenciaAndStatusOrderByIdDesc(
				normalizada, SincronizacaoRbxExecucao.Status.SUCESSO).map(execucao -> {
			try { return objectMapper.readValue(execucao.getResultadoJson(), tipo); }
			catch (JsonProcessingException erro) { throw new IllegalStateException("Resultado idempotente RBX invalido", erro); }
		});
	}

	private static String normalizarChave(String chave) {
		if (chave == null || chave.isBlank()) return null;
		String valor = chave.trim();
		if (valor.length() > 120) throw new IllegalArgumentException("Idempotency-Key deve ter no maximo 120 caracteres");
		return valor;
	}

	private SincronizacaoRbxExecucaoDTO dto(SincronizacaoRbxExecucao e) {
		return new SincronizacaoRbxExecucaoDTO(e.getId(), e.getChaveIdempotencia(), e.getOrigem(), e.getStatus().name(), e.getIniciadaEm(),
				e.getFinalizadaEm(), e.getDuracaoMs(), e.getDocumentosRecebidos(), e.getVencidos(),
				e.getCobrancasCriadas(), e.getBoletosCriados(), e.getMensagem());
	}
}
