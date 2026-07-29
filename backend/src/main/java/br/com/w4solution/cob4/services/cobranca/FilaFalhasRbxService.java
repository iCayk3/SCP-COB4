package br.com.w4solution.cob4.services.cobranca;

import br.com.w4solution.cob4.domain.FalhaSincronizacaoRbx;
import br.com.w4solution.cob4.dto.cobranca.FalhaSincronizacaoRbxDTO;
import br.com.w4solution.cob4.repositories.FalhaSincronizacaoRbxRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;

@Service
public class FilaFalhasRbxService {
	private final FalhaSincronizacaoRbxRepository repository;
	@Value("${sgc.rbx.fila.max-tentativas:8}")
	private int maxTentativas;
	@Value("${sgc.rbx.retry.backoff-max-ms:300000}")
	private long backoffMaxMs;
	@Value("${sgc.rbx.fila.backoff-inicial-ms:60000}")
	private long backoffInicialMs;
	@Value("${sgc.rbx.fila.lease-ms:900000}")
	private long leaseMs;

	public FilaFalhasRbxService(FalhaSincronizacaoRbxRepository repository) {
		this.repository = repository;
	}

	@Transactional
	public FalhaSincronizacaoRbx enfileirar(String origem, Throwable erro) {
		var agora = OffsetDateTime.now();
		var falha = new FalhaSincronizacaoRbx();
		falha.setOrigem(normalizarOrigem(origem));
		falha.setMaxTentativas(maxTentativas);
		falha.setCriadaEm(agora);
		falha.setProximaTentativaEm(agora.plusNanos(backoffInicialMs * 1_000_000));
		falha.setMensagem(mensagem(erro));
		return repository.save(falha);
	}

	@Transactional
	public FalhaSincronizacaoRbx preparar(Long id, boolean forcar) {
		var falha = repository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Falha RBX nao encontrada: " + id));
		if (falha.getStatus() == FalhaSincronizacaoRbx.Status.PROCESSANDO)
			throw new IllegalStateException("Falha RBX ja esta sendo reprocessada");
		if (!forcar && falha.getStatus() != FalhaSincronizacaoRbx.Status.PENDENTE)
			throw new IllegalStateException("Falha RBX nao esta pendente");
		if (falha.getStatus() == FalhaSincronizacaoRbx.Status.RESOLVIDA)
			throw new IllegalStateException("Falha RBX ja foi resolvida");
		falha.setStatus(FalhaSincronizacaoRbx.Status.PROCESSANDO);
		falha.setTentativas(falha.getTentativas() + 1);
		falha.setUltimaTentativaEm(OffsetDateTime.now());
		return repository.save(falha);
	}

	@Transactional
	public void resolver(Long id) {
		var falha = repository.findById(id).orElseThrow();
		falha.setStatus(FalhaSincronizacaoRbx.Status.RESOLVIDA);
		falha.setResolvidaEm(OffsetDateTime.now());
		repository.save(falha);
	}

	@Transactional
	public void reagendar(Long id, Throwable erro) {
		var falha = repository.findById(id).orElseThrow();
		falha.setMensagem(mensagem(erro));
		if (falha.getTentativas() >= falha.getMaxTentativas()) {
			falha.setStatus(FalhaSincronizacaoRbx.Status.ESGOTADA);
		} else {
			falha.setStatus(FalhaSincronizacaoRbx.Status.PENDENTE);
			long atraso = Math.min(backoffMaxMs,
					backoffInicialMs * (1L << Math.min(20, Math.max(0, falha.getTentativas() - 1))));
			falha.setProximaTentativaEm(OffsetDateTime.now().plusNanos(atraso * 1_000_000));
		}
		repository.save(falha);
	}

	@Transactional
	public List<FalhaSincronizacaoRbx> vencidas() {
		var agora = OffsetDateTime.now();
		var abandonadas = repository.findByStatusAndUltimaTentativaEmLessThan(
				FalhaSincronizacaoRbx.Status.PROCESSANDO, agora.minusNanos(leaseMs * 1_000_000));
		abandonadas.forEach(f -> {
			f.setStatus(FalhaSincronizacaoRbx.Status.PENDENTE);
			f.setProximaTentativaEm(agora);
			f.setMensagem("Lease de processamento expirou; item devolvido a fila");
		});
		repository.saveAll(abandonadas);
		return repository.findTop10ByStatusAndProximaTentativaEmLessThanEqualOrderByProximaTentativaEm(
				FalhaSincronizacaoRbx.Status.PENDENTE, agora);
	}

	@Transactional(readOnly = true)
	public List<FalhaSincronizacaoRbxDTO> listar() {
		return repository.findTop20ByOrderByCriadaEmDesc().stream().map(this::dto).toList();
	}

	private FalhaSincronizacaoRbxDTO dto(FalhaSincronizacaoRbx f) {
		return new FalhaSincronizacaoRbxDTO(f.getId(), f.getOrigem(), f.getStatus().name(), f.getTentativas(),
				f.getMaxTentativas(), f.getCriadaEm(), f.getProximaTentativaEm(), f.getUltimaTentativaEm(),
				f.getResolvidaEm(), f.getMensagem());
	}

	private static String normalizarOrigem(String origem) {
		return origem == null || origem.isBlank() ? "manual" : origem.trim();
	}

	private static String mensagem(Throwable erro) {
		String valor = erro == null ? "Falha desconhecida" : erro.getMessage();
		if (valor == null || valor.isBlank()) valor = erro.getClass().getSimpleName();
		return valor.substring(0, Math.min(2000, valor.length()));
	}
}
