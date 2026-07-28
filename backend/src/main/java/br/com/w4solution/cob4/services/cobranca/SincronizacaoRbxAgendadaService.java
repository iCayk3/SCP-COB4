package br.com.w4solution.cob4.services.cobranca;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import br.com.w4solution.cob4.repositories.SincronizacaoRbxConfigRepository;
import java.time.*;

@Service
public class SincronizacaoRbxAgendadaService {
	private static final Logger log = LoggerFactory.getLogger(SincronizacaoRbxAgendadaService.class);
	private final SincronizacaoRbxMonitorService monitorService;
	private final SincronizacaoRbxConfigService configService;
	private final SincronizacaoRbxConfigRepository configRepository;

	public SincronizacaoRbxAgendadaService(SincronizacaoRbxMonitorService monitorService,
			SincronizacaoRbxConfigService configService, SincronizacaoRbxConfigRepository configRepository) {
		this.monitorService = monitorService;
		this.configService = configService;
		this.configRepository = configRepository;
	}

	@Scheduled(fixedDelay = 60000, initialDelay = 10000)
	public synchronized void verificarHorarios() {
		var config = configService.obterEntidade();
		if (!config.isAtivo()) return;
		var agora = ZonedDateTime.now(ZoneId.of(config.getFusoHorario()));
		var hora = agora.toLocalTime();
		var hoje = agora.toLocalDate();
		if (!hora.isBefore(config.getHorarioSegunda()) && !hoje.equals(config.getUltimaSegunda())) {
			if (sincronizar("segunda janela")) {
				config.setUltimaSegunda(hoje);
				if (!hoje.equals(config.getUltimaPrimeira())) config.setUltimaPrimeira(hoje);
			}
		} else if (!hora.isBefore(config.getHorarioPrimeira()) && !hoje.equals(config.getUltimaPrimeira())) {
			if (sincronizar("primeira janela")) config.setUltimaPrimeira(hoje);
		}
		configRepository.save(config);
	}

	private boolean sincronizar(String janela) {
		try {
			var resultado = monitorService.sincronizar(janela);
			log.info("Sincronização RBX da {} concluída: {} protocolo(s), {} boleto(s) novo(s)",
					janela, resultado.cobrancasCriadas(), resultado.boletosCriados());
			return true;
		} catch (RuntimeException erro) {
			log.error("Falha na sincronização RBX da {}", janela, erro);
			return false;
		}
	}
}
