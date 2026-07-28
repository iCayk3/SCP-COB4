package br.com.w4solution.cob4.services.cobranca;

import br.com.w4solution.cob4.domain.SincronizacaoRbxExecucao;
import br.com.w4solution.cob4.dto.cobranca.SincronizacaoCobrancaDTO;
import br.com.w4solution.cob4.dto.cobranca.SincronizacaoRbxExecucaoDTO;
import br.com.w4solution.cob4.repositories.SincronizacaoRbxExecucaoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.OffsetDateTime;
import java.util.List;

@Service
public class SincronizacaoRbxMonitorService {
	private final CobrancaService cobrancaService;
	private final SincronizacaoRbxExecucaoRepository repository;

	public SincronizacaoRbxMonitorService(CobrancaService cobrancaService,
										  SincronizacaoRbxExecucaoRepository repository) {
		this.cobrancaService = cobrancaService;
		this.repository = repository;
	}

	@Transactional
	public SincronizacaoCobrancaDTO sincronizar(String origem) {
		OffsetDateTime inicio = OffsetDateTime.now();
		try {
			SincronizacaoCobrancaDTO resultado = cobrancaService.sincronizarInadimplentes();
			registrar(origem, inicio, SincronizacaoRbxExecucao.Status.SUCESSO, resultado, "Sincronizacao concluida");
			return resultado;
		} catch (RuntimeException erro) {
			registrar(origem, inicio, SincronizacaoRbxExecucao.Status.FALHA, null, erro.getMessage());
			throw erro;
		}
	}

	@Transactional(readOnly = true)
	public List<SincronizacaoRbxExecucaoDTO> recentes() {
		return repository.findTop20ByOrderByIniciadaEmDesc().stream().map(this::dto).toList();
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
