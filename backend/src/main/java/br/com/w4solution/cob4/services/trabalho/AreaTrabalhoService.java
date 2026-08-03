package br.com.w4solution.cob4.services.trabalho;

import br.com.w4solution.cob4.domain.*;
import br.com.w4solution.cob4.dto.trabalho.AreaTrabalhoDTO;
import br.com.w4solution.cob4.repositories.*;
import br.com.w4solution.cob4.security.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.*;
import java.util.*;

@Service
public class AreaTrabalhoService {
	private static final ZoneId ZONA = ZoneId.of("America/Sao_Paulo");
	private static final List<Cobranca.Status> ATIVOS = List.of(Cobranca.Status.ABERTA, Cobranca.Status.EM_ANDAMENTO);
	private final CobrancaRepository cobrancas; private final TarefaCobrancaRepository tarefas;
	private final PromessaPagamentoRepository promessas; private final AtendimentoRepository atendimentos;
	private final UsuarioAtualService usuarioAtual;
	public AreaTrabalhoService(CobrancaRepository c,TarefaCobrancaRepository t,PromessaPagamentoRepository p,
			AtendimentoRepository a,UsuarioAtualService u){cobrancas=c;tarefas=t;promessas=p;atendimentos=a;usuarioAtual=u;}

	@Transactional(readOnly=true)
	public AreaTrabalhoDTO consultar(){
		var u=usuarioAtual.atual(); var agora=OffsetDateTime.now();
		var inicio=LocalDate.now(ZONA).atStartOfDay(ZONA).toOffsetDateTime(); var fim=inicio.plusDays(1);
		var carteira=cobrancas.findByStatusInAndResponsavelIdentificadorOrderByPrioridadeDescAtualizadaEmAsc(ATIVOS,u.identificador());
		var abertas=tarefas.findByResponsavelIdentificadorAndStatusInOrderByPrazoEmAsc(u.identificador(),List.of(TarefaCobranca.Status.PENDENTE,TarefaCobranca.Status.EM_ANDAMENTO));
		long atrasadas=abertas.stream().filter(t->t.getPrazoEm()!=null&&t.getPrazoEm().isBefore(agora)).count();
		long promessasHoje=promessas.countByCobrancaResponsavelIdentificadorAndStatusAndVencimento(
				u.identificador(),PromessaPagamento.Status.ABERTA,LocalDate.now(ZONA));
		long criticos=carteira.stream().filter(c->c.getSlaPausadoEm()==null&&c.getUltimaMovimentacaoEm().plusHours(c.getSlaHoras()).isBefore(agora)).count();
		BigDecimal valor=carteira.stream().map(Cobranca::getValorTotal).reduce(BigDecimal.ZERO,BigDecimal::add);
		AreaTrabalhoDTO.ProximaAtividadeDTO proxima=abertas.stream().findFirst().map(t->new AreaTrabalhoDTO.ProximaAtividadeDTO(
				t.getTipo(),t.getCobranca().getReferencia(),t.getTitulo(),t.getPrioridade().name(),t.getPrazoEm())).orElse(null);
		var alertas=new ArrayList<AreaTrabalhoDTO.AlertaDTO>();
		carteira.stream().filter(c->c.getPrioridade()==Cobranca.Prioridade.CRITICA||
				(c.getSlaPausadoEm()==null&&c.getUltimaMovimentacaoEm().plusHours(c.getSlaHoras()).isBefore(agora)))
				.limit(10).forEach(c->alertas.add(new AreaTrabalhoDTO.AlertaDTO("SLA",c.getReferencia(),"Processo exige acao imediata","CRITICA")));
		long total=atendimentos.countByOperadorIdentificadorAndRealizadoEmBetween(u.identificador(),inicio,fim);
		long contatos=atendimentos.countByOperadorIdentificadorAndRealizadoEmBetweenAndResultadoNot(u.identificador(),inicio,fim,Atendimento.Resultado.SEM_CONTATO);
		long negociacoes=atendimentos.countByOperadorIdentificadorAndRealizadoEmBetweenAndResultadoIn(u.identificador(),inicio,fim,
				List.of(Atendimento.Resultado.NEGOCIACAO,Atendimento.Resultado.PROMESSA,Atendimento.Resultado.PAGAMENTO));
		return new AreaTrabalhoDTO(agora,new AreaTrabalhoDTO.ResumoDTO(carteira.size(),atrasadas,promessasHoje,criticos,valor),
				proxima,List.copyOf(alertas),new AreaTrabalhoDTO.DesempenhoDTO(total,contatos,negociacoes));
	}
}
