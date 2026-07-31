package br.com.w4solution.cob4.services.lgpd;

import br.com.w4solution.cob4.domain.*;
import br.com.w4solution.cob4.repositories.*;
import br.com.w4solution.cob4.services.usuario.AuditoriaSegurancaService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.OffsetDateTime;
import java.util.*;

@Service
public class RetencaoService {
	private final PoliticaLgpdRepository politicas; private final ExecucaoRetencaoRepository execucoes;
	private final AtendimentoAnexoRepository anexos; private final LogAuditoriaRepository logs;
	private final ClienteRepository clientes; private final CobrancaRepository cobrancas; private final HistoricoAtrasoRepository historicos;
	private final AuditoriaSegurancaService auditoria;
	public RetencaoService(PoliticaLgpdRepository p,ExecucaoRetencaoRepository e,AtendimentoAnexoRepository a,LogAuditoriaRepository l,ClienteRepository c,CobrancaRepository co,HistoricoAtrasoRepository h,AuditoriaSegurancaService au){politicas=p;execucoes=e;anexos=a;logs=l;clientes=c;cobrancas=co;historicos=h;auditoria=au;}
	@Transactional(readOnly=true) public List<ExecucaoRetencao> historico(){return execucoes.findTop20ByOrderByIniciadaEmDesc();}
	@Scheduled(cron="${sgc.lgpd.retencao.cron:0 15 2 * * *}",zone="${sgc.cobranca.sla.zona:America/Sao_Paulo}")
	public void agendada(){executar(false);}
	@Transactional public ExecucaoRetencao executar(boolean simulacao){var e=new ExecucaoRetencao();e.setIniciadaEm(OffsetDateTime.now());e.setStatus(ExecucaoRetencao.Status.INICIADA);e.setModoSimulacao(simulacao);e.setDetalhes("Iniciada");e=execucoes.save(e);
		int avaliados=0,processados=0;var detalhes=new ArrayList<String>();try{
			for(var p:politicas.findAllByOrderByCategoriaAsc()){
				if(p.getStatusAprovacao()!=PoliticaLgpd.StatusAprovacao.APROVADA||p.getRetencaoMeses()==null)continue;
				var limite=OffsetDateTime.now().minusMonths(p.getRetencaoMeses());int a=0,x=0;
				switch(p.getCodigo()){
					case "COMPROVANTES" -> {var itens=anexos.findByClassificacaoAndEnviadoEmBefore(AtendimentoAnexo.Classificacao.COMPROVANTE,limite);a=itens.size();if(!simulacao&&p.getDestinoFinal()==PoliticaLgpd.DestinoFinal.ELIMINAR){anexos.deleteAllInBatch(itens);x=a;}}
					case "AUDITORIA" -> {a=Math.toIntExact(logs.countByCriadoEmBefore(limite));if(!simulacao&&p.getDestinoFinal()==PoliticaLgpd.DestinoFinal.ANONIMIZAR)x=logs.anonimizarAntesDe(limite);}
					case "IDENTIFICACAO_CLIENTE","CONTATO" -> {var itens=clientes.elegiveisRetencao(limite);a=itens.size();if(!simulacao){for(var c:itens){if("CONTATO".equals(p.getCodigo())&&p.getDestinoFinal()==PoliticaLgpd.DestinoFinal.ELIMINAR){c.setTelefone(null);c.setEmail(null);x++;}else if("IDENTIFICACAO_CLIENTE".equals(p.getCodigo())&&p.getDestinoFinal()==PoliticaLgpd.DestinoFinal.ANONIMIZAR){anonimizar(c);x++;}}clientes.saveAll(itens);}}
					default -> { }
				}avaliados+=a;processados+=x;detalhes.add(p.getCodigo()+": "+a+" elegíveis, "+x+" processados");
			}
			e.setStatus(ExecucaoRetencao.Status.CONCLUIDA);e.setDetalhes(String.join("; ",detalhes));
		}catch(Exception ex){e.setStatus(ExecucaoRetencao.Status.FALHOU);e.setDetalhes(ex.getClass().getSimpleName()+": "+ex.getMessage());
		}finally{e.setItensAvaliados(avaliados);e.setItensProcessados(processados);e.setConcluidaEm(OffsetDateTime.now());execucoes.save(e);auditoria.registrar("RETENCAO_EXECUTADA","Sistema","RETENCAO",(simulacao?"Simulação":"Execução")+" LGPD: "+processados+" itens processados");}return e;}
	private void anonimizar(Cliente c){String cpf=c.getCpf();String novo="ANON-"+hash(cpf).substring(0,9);cobrancas.anonimizarCpf(cpf,novo);historicos.anonimizarCpf(cpf,novo);c.setCpf(novo);c.setNomeCompleto("Titular anonimizado");c.setTelefone(null);c.setEmail(null);c.setRbxCodigo(null);c.setAtualizadoEm(OffsetDateTime.now());}
	private String hash(String v){try{return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(v.getBytes(StandardCharsets.UTF_8))).toUpperCase();}catch(Exception e){throw new IllegalStateException(e);}}
}
