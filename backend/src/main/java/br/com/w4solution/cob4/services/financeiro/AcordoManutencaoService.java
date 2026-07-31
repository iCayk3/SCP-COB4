package br.com.w4solution.cob4.services.financeiro;
import br.com.w4solution.cob4.domain.*;import br.com.w4solution.cob4.repositories.AcordoFinanceiroRepository;import org.springframework.scheduling.annotation.Scheduled;import org.springframework.stereotype.Service;import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
@Service public class AcordoManutencaoService{private final AcordoFinanceiroRepository repository;public AcordoManutencaoService(AcordoFinanceiroRepository r){repository=r;}
	@Scheduled(cron="${sgc.financeiro.acordos.cron:0 20 1 * * *}",zone="America/Sao_Paulo") @Transactional public void verificarQuebras(){for(var a:repository.findByStatus(AcordoFinanceiro.Status.ATIVO)){int vencidas=0;for(var p:a.getParcelas())if(p.getStatus()!=ParcelaAcordo.Status.PAGA&&p.getVencimento().plusDays(a.getPolitica().getToleranciaParcelaDias()).isBefore(LocalDate.now())){p.setStatus(ParcelaAcordo.Status.VENCIDA);vencidas++;}if(vencidas>=a.getPolitica().getParcelasVencidasParaQuebra())a.setStatus(AcordoFinanceiro.Status.QUEBRADO);}}
}
