package br.com.w4solution.cob4.services.planejamento;
import br.com.w4solution.cob4.repositories.FechamentoMensalRepository;import org.springframework.scheduling.annotation.Scheduled;import org.springframework.stereotype.Service;
import java.time.*;
@Service public class FechamentoMensalAgendadoService{
	private final FechamentoMensalService service;private final FechamentoMensalRepository repository;
	public FechamentoMensalAgendadoService(FechamentoMensalService s,FechamentoMensalRepository r){service=s;repository=r;}
	@Scheduled(cron="${sgc.financeiro.fechamento.cron:0 0 0 5 * *}",zone="America/Sao_Paulo")
	public void gerar(){YearMonth competencia=YearMonth.now(ZoneId.of("America/Sao_Paulo")).minusMonths(1);if(repository.findByCompetenciaOrderByVersaoDesc(competencia.toString()).isEmpty())service.gerar(competencia,"SISTEMA","Fechamento automatico do dia 5");}
}
