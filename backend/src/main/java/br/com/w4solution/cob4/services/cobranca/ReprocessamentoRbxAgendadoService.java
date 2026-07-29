package br.com.w4solution.cob4.services.cobranca;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class ReprocessamentoRbxAgendadoService {
	private static final Logger log = LoggerFactory.getLogger(ReprocessamentoRbxAgendadoService.class);
	private final FilaFalhasRbxService fila;
	private final SincronizacaoRbxMonitorService monitor;

	public ReprocessamentoRbxAgendadoService(FilaFalhasRbxService fila, SincronizacaoRbxMonitorService monitor) {
		this.fila = fila;
		this.monitor = monitor;
	}

	@Scheduled(fixedDelayString = "${sgc.rbx.fila.verificacao-ms:30000}",
			initialDelayString = "${sgc.rbx.fila.verificacao-inicial-ms:30000}")
	public void reprocessarPendentes() {
		for (var falha : fila.vencidas()) {
			try {
				monitor.reprocessar(falha.getId());
			} catch (RuntimeException erro) {
				log.warn("Reprocessamento da falha RBX {} nao concluido: {}", falha.getId(), erro.getMessage());
			}
		}
	}
}
