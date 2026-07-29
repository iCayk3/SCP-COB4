package br.com.w4solution.cob4.services.cobranca;

import br.com.w4solution.cob4.domain.SincronizacaoRbxExecucao;
import br.com.w4solution.cob4.dto.cobranca.SincronizacaoCobrancaDTO;
import br.com.w4solution.cob4.dto.cobranca.FalhaSincronizacaoRbxDTO;
import br.com.w4solution.cob4.dto.cobranca.SincronizacaoRbxExecucaoDTO;
import br.com.w4solution.cob4.repositories.SincronizacaoRbxExecucaoRepository;
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
	@Value("${sgc.rbx.retry.max-tentativas:3}")
	private int maxTentativas = 3;
	@Value("${sgc.rbx.retry.backoff-inicial-ms:250}")
	private long backoffInicialMs = 250;
	@Value("${sgc.rbx.retry.backoff-max-ms:300000}")
	private long backoffMaxMs = 300000;

	public SincronizacaoRbxMonitorService(CobrancaService cobrancaService,
										  SincronizacaoRbxExecucaoRepository repository,
										  FilaFalhasRbxService filaFalhas) {
		this.cobrancaService = cobrancaService;
		this.repository = repository;
		this.filaFalhas = filaFalhas;
	}

	public SincronizacaoCobrancaDTO sincronizar(String origem) {
		return executarComRetry(origem, true);
	}

	public SincronizacaoCobrancaDTO reconciliar() {
		return executarComRetry("reconciliacao", true);
	}

	public SincronizacaoCobrancaDTO reprocessar(Long falhaId) {
		var falha = filaFalhas.preparar(falhaId, true);
		try {
			var resultado = executarComRetry("reprocessamento:" + falha.getId(), false);
			filaFalhas.resolver(falha.getId());
			return resultado;
		} catch (RuntimeException erro) {
			filaFalhas.reagendar(falha.getId(), erro);
			throw erro;
		}
	}

	private SincronizacaoCobrancaDTO executarComRetry(String origem, boolean enfileirar) {
		OffsetDateTime inicio = OffsetDateTime.now();
		RuntimeException ultimaFalha = null;
		for (int tentativa = 1; tentativa <= Math.max(1, maxTentativas); tentativa++) {
			try {
				SincronizacaoCobrancaDTO resultado = cobrancaService.sincronizarInadimplentes();
				registrar(origem, inicio, SincronizacaoRbxExecucao.Status.SUCESSO, resultado,
						"Sincronizacao concluida na tentativa " + tentativa);
				return resultado;
			} catch (RuntimeException erro) {
				ultimaFalha = erro;
				if (tentativa < maxTentativas) aguardar(backoff(tentativa));
			}
		}
		registrar(origem, inicio, SincronizacaoRbxExecucao.Status.FALHA, null, ultimaFalha.getMessage());
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

	private void registrar(String origem, OffsetDateTime inicio, SincronizacaoRbxExecucao.Status status,
						   SincronizacaoCobrancaDTO resultado, String mensagem) {
		OffsetDateTime fim = OffsetDateTime.now();
		SincronizacaoRbxExecucao execucao = new SincronizacaoRbxExecucao();
		execucao.setOrigem(origem == null || origem.isBlank() ? "manual" : origem.trim());
		execucao.setStatus(status);
		execucao.setIniciadaEm(inicio);
		execucao.setFinalizadaEm(fim);
		execucao.setDuracaoMs(Duration.between(inicio, fim).toMillis());
		if (resultado != null) {
			execucao.setDocumentosRecebidos(resultado.documentosRecebidos());
			execucao.setVencidos(resultado.documentosVencidos());
			execucao.setCobrancasCriadas(resultado.cobrancasCriadas());
			execucao.setBoletosCriados(resultado.boletosCriados());
		}
		execucao.setMensagem(mensagem == null ? null : mensagem.substring(0, Math.min(2000, mensagem.length())));
		repository.save(execucao);
	}

	private SincronizacaoRbxExecucaoDTO dto(SincronizacaoRbxExecucao e) {
		return new SincronizacaoRbxExecucaoDTO(e.getId(), e.getOrigem(), e.getStatus().name(), e.getIniciadaEm(),
				e.getFinalizadaEm(), e.getDuracaoMs(), e.getDocumentosRecebidos(), e.getVencidos(),
				e.getCobrancasCriadas(), e.getBoletosCriados(), e.getMensagem());
	}
}
