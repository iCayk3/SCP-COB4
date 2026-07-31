package br.com.w4solution.cob4.services.financeiro;
import br.com.w4solution.cob4.domain.*;
import br.com.w4solution.cob4.dto.financeiro.*;
import br.com.w4solution.cob4.repositories.*;
import br.com.w4solution.cob4.security.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.*;
import java.time.OffsetDateTime;
import java.util.*;

@Service
public class FinanceiroPagamentoService {
	private final PagamentoFinanceiroRepository pagamentos; private final CobrancaRepository cobrancas;
	private final AcordoFinanceiroRepository acordos; private final AtendimentoAnexoRepository anexos;
	private final ParcelaAcordoRepository parcelas; private final UsuarioAtualService usuarios;
	public FinanceiroPagamentoService(PagamentoFinanceiroRepository p,CobrancaRepository c,AcordoFinanceiroRepository a,
			AtendimentoAnexoRepository an,ParcelaAcordoRepository pa,UsuarioAtualService u){pagamentos=p;cobrancas=c;acordos=a;anexos=an;parcelas=pa;usuarios=u;}

	@Transactional public PagamentoFinanceiroDTO registrar(RegistrarPagamentoFinanceiroDTO d){
		return pagamentos.findByChaveIdempotencia(d.chaveIdempotencia()).map(this::dto).orElseGet(()->{
			Cobranca c=cobrancas.findByReferencia(d.cobrancaReferencia()).orElseThrow(()->new IllegalArgumentException("Cobranca nao encontrada"));
			AtendimentoAnexo an=anexos.findById(d.comprovanteId()).orElseThrow(()->new IllegalArgumentException("Comprovante nao encontrado"));
			if(an.getClassificacao()!=AtendimentoAnexo.Classificacao.COMPROVANTE||!an.getCobranca().getId().equals(c.getId()))throw new IllegalArgumentException("Comprovante invalido para esta cobranca");
			PagamentoFinanceiro p=new PagamentoFinanceiro();p.setCobranca(c);p.setComprovante(an);p.setValor(d.valor());p.setDataPagamento(d.dataPagamento());
			p.setOrigem(d.origem());p.setReferenciaExterna(d.referenciaExterna());p.setChaveIdempotencia(d.chaveIdempotencia());p.setObservacao(d.observacao());
			var u=usuarios.atual();p.setRegistradoPor(u.identificador());p.setRegistradoEm(OffsetDateTime.now());
			if(d.acordoProtocolo()!=null&&!d.acordoProtocolo().isBlank()){var a=acordos.findByProtocolo(d.acordoProtocolo()).orElseThrow(()->new IllegalArgumentException("Acordo nao encontrado"));if(a.getStatus()!=AcordoFinanceiro.Status.ATIVO)throw new IllegalStateException("Acordo nao esta ativo");p.setAcordo(a);}
			return dto(pagamentos.save(p));});
	}
	@Transactional public PagamentoFinanceiroDTO confirmar(Long id){
		var u=usuarios.atual();if(!EnumSet.of(PerfilUsuario.FINANCEIRO,PerfilUsuario.GERENTE,PerfilUsuario.ADMINISTRADOR).contains(u.perfil()))throw new org.springframework.security.access.AccessDeniedException("Confirmacao restrita ao financeiro");
		PagamentoFinanceiro p=pagamentos.findById(id).orElseThrow();if(p.getStatus()!=PagamentoFinanceiro.Status.PENDENTE)throw new IllegalStateException("Pagamento nao esta pendente");
		if(p.getAcordo()!=null)alocarAcordo(p);else alocarCobranca(p);p.setStatus(PagamentoFinanceiro.Status.CONFIRMADO);p.setConfirmadoEm(OffsetDateTime.now());p.setConfirmadoPor(u.identificador());return dto(pagamentos.save(p));
	}
	@Transactional public PagamentoFinanceiroDTO estornar(Long id,String motivo){
		var u=usuarios.atual();PagamentoFinanceiro p=pagamentos.findById(id).orElseThrow();if(!EnumSet.of(PagamentoFinanceiro.Status.CONFIRMADO,PagamentoFinanceiro.Status.CONCILIADO).contains(p.getStatus()))throw new IllegalStateException("Pagamento nao pode ser estornado");
		for(var al:p.getAlocacoes())if(al.getParcela()!=null){var pa=al.getParcela();pa.setValorPago(pa.getValorPago().subtract(al.getTotal()).max(BigDecimal.ZERO));pa.setStatus(pa.getValorPago().signum()==0?ParcelaAcordo.Status.PENDENTE:ParcelaAcordo.Status.PARCIAL);}
		if(p.getAcordo()!=null){p.getAcordo().setStatus(AcordoFinanceiro.Status.ATIVO);for(var item:p.getAcordo().getItens()){var c=item.getCobranca();c.setValorTotal(c.getValorTotal().add(alocadoPrincipal(p,item)));reabrir(c);}}
		else{p.getCobranca().setValorTotal(p.getCobranca().getValorTotal().add(p.getValor().subtract(p.getCreditoExcedente())));reabrir(p.getCobranca());}
		p.setStatus(PagamentoFinanceiro.Status.ESTORNADO);p.setObservacao((p.getObservacao()==null?"":p.getObservacao()+" | ")+"Estorno: "+motivo+" por "+u.identificador());return dto(pagamentos.save(p));
	}
	@Transactional(readOnly=true) public List<PagamentoFinanceiroDTO> listar(String ref){return pagamentos.findByCobrancaReferenciaOrderByRegistradoEmDesc(ref).stream().map(this::dto).toList();}
	private void alocarAcordo(PagamentoFinanceiro p){BigDecimal restante=p.getValor();for(var pa:parcelas.findByAcordoIdOrderByNumeroAsc(p.getAcordo().getId())){if(restante.signum()==0)break;BigDecimal saldo=pa.getTotal().subtract(pa.getValorPago());if(saldo.signum()<=0)continue;BigDecimal uso=restante.min(saldo);PagamentoAlocacao al=componentes(p,pa,uso);p.getAlocacoes().add(al);pa.setValorPago(pa.getValorPago().add(uso));pa.setStatus(pa.getValorPago().compareTo(pa.getTotal())>=0?ParcelaAcordo.Status.PAGA:ParcelaAcordo.Status.PARCIAL);restante=restante.subtract(uso);}p.setCreditoExcedente(restante);
		BigDecimal aplicado=p.getValor().subtract(restante);BigDecimal totalPrincipal=p.getAcordo().getItens().stream().map(AcordoItem::getPrincipal).reduce(BigDecimal.ZERO,BigDecimal::add);for(var i:p.getAcordo().getItens()){BigDecimal rateio=totalPrincipal.signum()==0?BigDecimal.ZERO:aplicado.multiply(i.getPrincipal()).divide(totalPrincipal,2,RoundingMode.HALF_UP);i.getCobranca().setValorTotal(i.getCobranca().getValorTotal().subtract(rateio).max(BigDecimal.ZERO));}
		boolean quitado=p.getAcordo().getParcelas().stream().allMatch(x->x.getStatus()==ParcelaAcordo.Status.PAGA);if(quitado){p.getAcordo().setStatus(AcordoFinanceiro.Status.CUMPRIDO);for(var i:p.getAcordo().getItens())encerrar(i.getCobranca());}}
	private PagamentoAlocacao componentes(PagamentoFinanceiro p,ParcelaAcordo pa,BigDecimal uso){BigDecimal anterior=pa.getValorPago(),restante=uso;BigDecimal multaPaga=anterior.min(pa.getMulta()),multa=pa.getMulta().subtract(multaPaga).max(BigDecimal.ZERO).min(restante);restante=restante.subtract(multa);BigDecimal antesJuros=anterior.subtract(multaPaga).max(BigDecimal.ZERO),juros=pa.getJuros().subtract(antesJuros.min(pa.getJuros())).max(BigDecimal.ZERO).min(restante);restante=restante.subtract(juros);PagamentoAlocacao al=new PagamentoAlocacao();al.setPagamento(p);al.setParcela(pa);al.setMulta(multa);al.setJuros(juros);al.setPrincipal(restante);al.setTotal(uso);return al;}
	private void alocarCobranca(PagamentoFinanceiro p){BigDecimal uso=p.getValor().min(p.getCobranca().getValorTotal());p.setCreditoExcedente(p.getValor().subtract(uso));PagamentoAlocacao al=new PagamentoAlocacao();al.setPagamento(p);al.setPrincipal(uso);al.setTotal(uso);p.getAlocacoes().add(al);p.getCobranca().setValorTotal(p.getCobranca().getValorTotal().subtract(uso));if(p.getCobranca().getValorTotal().signum()==0)encerrar(p.getCobranca());}
	private BigDecimal alocadoPrincipal(PagamentoFinanceiro p,AcordoItem item){BigDecimal total=p.getAcordo().getPrincipalOriginal();return total.signum()==0?BigDecimal.ZERO:p.getAlocacoes().stream().map(PagamentoAlocacao::getPrincipal).reduce(BigDecimal.ZERO,BigDecimal::add).multiply(item.getPrincipal()).divide(total,2,RoundingMode.HALF_UP);}
	private void encerrar(Cobranca c){c.autorizarReabertura();c.setStatus(Cobranca.Status.PAGA);c.setEstadoFluxo("ENCERRADO");c.setEncerradaEm(OffsetDateTime.now());c.setMotivoEncerramento("Pagamento integral confirmado");}
	private void reabrir(Cobranca c){c.autorizarReabertura();c.setStatus(Cobranca.Status.EM_ANDAMENTO);c.setEstadoFluxo("EM_ATENDIMENTO");c.setEncerradaEm(null);c.setMotivoEncerramento(null);}
	private PagamentoFinanceiroDTO dto(PagamentoFinanceiro p){return new PagamentoFinanceiroDTO(p.getId(),p.getCobranca().getReferencia(),p.getAcordo()==null?null:p.getAcordo().getProtocolo(),p.getValor(),p.getCreditoExcedente(),p.getDataPagamento(),p.getStatus().name(),p.getOrigem().name(),p.getReferenciaExterna(),p.getComprovante().getId(),p.getChaveIdempotencia(),p.getRegistradoEm(),p.getRegistradoPor(),p.getConfirmadoEm(),p.getConfirmadoPor(),p.getObservacao(),p.getAlocacoes().stream().map(a->new PagamentoFinanceiroDTO.Alocacao(a.getParcela()==null?null:a.getParcela().getId(),a.getParcela()==null?null:a.getParcela().getNumero(),a.getMulta(),a.getJuros(),a.getPrincipal(),a.getTotal())).toList());}
}
