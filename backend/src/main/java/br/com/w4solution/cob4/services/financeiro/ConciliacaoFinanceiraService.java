package br.com.w4solution.cob4.services.financeiro;
import br.com.w4solution.cob4.domain.PagamentoFinanceiro;import br.com.w4solution.cob4.dto.financeiro.ConciliacaoFinanceiraDTO;
import br.com.w4solution.cob4.repositories.PagamentoFinanceiroRepository;import org.springframework.stereotype.Service;import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;import java.time.*;import java.util.*;
@Service public class ConciliacaoFinanceiraService{
	private final PagamentoFinanceiroRepository repository;public ConciliacaoFinanceiraService(PagamentoFinanceiroRepository r){repository=r;}
	@Transactional public ConciliacaoFinanceiraDTO executar(){var lista=repository.findByStatusIn(List.of(PagamentoFinanceiro.Status.CONFIRMADO,PagamentoFinanceiro.Status.DIVERGENTE));var itens=new ArrayList<ConciliacaoFinanceiraDTO.Item>();int ok=0,div=0,pend=0;BigDecimal valor=BigDecimal.ZERO;
		for(var p:lista){String motivo;if(p.getReferenciaExterna()!=null&&!p.getReferenciaExterna().isBlank()){p.setStatus(PagamentoFinanceiro.Status.CONCILIADO);motivo="Referencia externa confirmada";ok++;}else if(p.getConfirmadoEm()!=null&&p.getConfirmadoEm().isBefore(OffsetDateTime.now().minusDays(2))){p.setStatus(PagamentoFinanceiro.Status.DIVERGENTE);motivo="Movimento nao localizado no RBX apos dois dias";div++;valor=valor.add(p.getValor());}else{motivo="Aguardando janela de processamento do RBX";pend++;}itens.add(new ConciliacaoFinanceiraDTO.Item(p.getId(),p.getCobranca().getReferencia(),p.getStatus().name(),motivo,p.getValor(),p.getReferenciaExterna()));}
		return new ConciliacaoFinanceiraDTO(OffsetDateTime.now(),ok,div,pend,valor,itens);}
	@org.springframework.scheduling.annotation.Scheduled(cron="${sgc.financeiro.conciliacao.cron:0 0 3 * * *}",zone="America/Sao_Paulo") @Transactional public void executarAgendado(){executar();}
}
