package br.com.w4solution.cob4.services.atendimento;

import br.com.w4solution.cob4.domain.*;
import br.com.w4solution.cob4.dto.atendimento.*;
import br.com.w4solution.cob4.repositories.*;
import br.com.w4solution.cob4.security.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.security.MessageDigest;
import java.time.OffsetDateTime;
import java.util.*;

@Service
public class Cliente360Service {
	private static final long MAX_ANEXO = 10 * 1024 * 1024;
	private static final Set<String> TIPOS = Set.of("application/pdf", "image/png", "image/jpeg", "text/plain");
	private final CobrancaRepository cobrancas; private final AtendimentoAnexoRepository anexos;
	private final AgendamentoAtendimentoRepository agenda; private final ClienteRepository clientes;
	private final SolicitacaoAtualizacaoClienteRepository atualizacoes; private final UsuarioAtualService usuarioAtual;
	public Cliente360Service(CobrancaRepository c, AtendimentoAnexoRepository a, AgendamentoAtendimentoRepository g,
			ClienteRepository cl, SolicitacaoAtualizacaoClienteRepository at, UsuarioAtualService u) {
		cobrancas=c; anexos=a; agenda=g; clientes=cl; atualizacoes=at; usuarioAtual=u;
	}
	public record AnexoResumo(Long id,String nome,String tipo,long tamanho,String sha256,OffsetDateTime enviadoEm,String enviadoPor){}
	public record AgendaResumo(Long id,String titulo,String observacao,OffsetDateTime inicioEm,OffsetDateTime fimEm,String status,String responsavel){}
	public record AtualizacaoResumo(Long id,String telefone,String email,String motivo,String status,String solicitadoPor,OffsetDateTime solicitadoEm){}
	@Transactional public AnexoResumo anexar(String ref, MultipartFile arquivo) throws Exception {
		if (arquivo.isEmpty() || arquivo.getSize()>MAX_ANEXO) throw new IllegalArgumentException("Anexo deve ter entre 1 byte e 10 MB");
		if (!TIPOS.contains(arquivo.getContentType())) throw new IllegalArgumentException("Tipo de arquivo não permitido");
		var p=processo(ref); var u=usuarioAtual.atual(); var bytes=arquivo.getBytes(); var a=new AtendimentoAnexo();
		a.setCobranca(p); a.setNomeOriginal(nomeSeguro(arquivo.getOriginalFilename())); a.setTipoConteudo(arquivo.getContentType());
		a.setTamanho(bytes.length); a.setConteudo(bytes); a.setSha256(HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(bytes)));
		a.setEnviadoPor(u.identificador()); a.setEnviadoEm(OffsetDateTime.now()); return anexo(anexos.save(a));
	}
	@Transactional(readOnly=true) public List<AnexoResumo> listarAnexos(String ref){ processo(ref); return anexos.findByCobrancaReferenciaOrderByEnviadoEmDesc(ref).stream().map(this::anexo).toList(); }
	@Transactional(readOnly=true) public AtendimentoAnexo baixar(String ref,Long id){ processo(ref); var a=anexos.findById(id).orElseThrow(); if(!a.getCobranca().getReferencia().equals(ref)) throw new NoSuchElementException(); return a; }
	@Transactional public AgendaResumo agendar(String ref,AgendaDTO d){ if(!d.fimEm().isAfter(d.inicioEm())) throw new IllegalArgumentException("Fim deve ser posterior ao início"); var a=new AgendamentoAtendimento(); a.setCobranca(processo(ref)); a.setTitulo(d.titulo().trim()); a.setObservacao(d.observacao()); a.setInicioEm(d.inicioEm()); a.setFimEm(d.fimEm()); a.setResponsavel(usuarioAtual.atual().identificador()); a.setCriadoEm(OffsetDateTime.now()); return ag(agenda.save(a)); }
	@Transactional(readOnly=true) public List<AgendaResumo> listarAgenda(String ref){ processo(ref); return agenda.findByCobrancaReferenciaOrderByInicioEmAsc(ref).stream().map(this::ag).toList(); }
	@Transactional public AgendaResumo statusAgenda(String ref,Long id,AgendamentoAtendimento.Status status){ processo(ref); var a=agenda.findById(id).orElseThrow(); if(!a.getCobranca().getReferencia().equals(ref)) throw new NoSuchElementException(); a.setStatus(status); return ag(agenda.save(a)); }
	@Transactional public AtualizacaoResumo solicitar(String cpf,AtualizacaoClienteDTO d){ var c=clientes.findByCpf(cpf).orElseThrow(); if(atualizacoes.existsByClienteIdAndStatus(c.getId(),SolicitacaoAtualizacaoCliente.Status.PENDENTE)) throw new IllegalStateException("Já existe atualização pendente"); var s=new SolicitacaoAtualizacaoCliente(); s.setCliente(c); s.setNovoTelefone(d.telefone()); s.setNovoEmail(d.email()); s.setMotivo(d.motivo().trim()); s.setSolicitadoPor(usuarioAtual.atual().identificador()); s.setSolicitadoEm(OffsetDateTime.now()); return atu(atualizacoes.save(s)); }
	@Transactional(readOnly=true) public List<AtualizacaoResumo> listarAtualizacoes(String cpf){ return atualizacoes.findByClienteCpfOrderBySolicitadoEmDesc(cpf).stream().map(this::atu).toList(); }
	@Transactional public AtualizacaoResumo decidir(Long id,boolean aprovar){ var u=usuarioAtual.atual(); if(u.perfil()!=PerfilUsuario.SUPERVISOR&&u.perfil()!=PerfilUsuario.GERENTE&&u.perfil()!=PerfilUsuario.ADMINISTRADOR) throw new org.springframework.security.access.AccessDeniedException("Apenas supervisão pode decidir"); var s=atualizacoes.findById(id).orElseThrow(); if(s.getStatus()!=SolicitacaoAtualizacaoCliente.Status.PENDENTE) throw new IllegalStateException("Solicitação já decidida"); s.setStatus(aprovar?SolicitacaoAtualizacaoCliente.Status.APROVADA:SolicitacaoAtualizacaoCliente.Status.REJEITADA); s.setDecididoPor(u.identificador()); s.setDecididoEm(OffsetDateTime.now()); if(aprovar){ if(s.getNovoTelefone()!=null)s.getCliente().setTelefone(s.getNovoTelefone()); if(s.getNovoEmail()!=null)s.getCliente().setEmail(s.getNovoEmail()); s.getCliente().setAtualizadoEm(OffsetDateTime.now()); clientes.save(s.getCliente()); } return atu(atualizacoes.save(s)); }
	private Cobranca processo(String r){return cobrancas.findByReferencia(r).orElseThrow(()->new IllegalArgumentException("Processo não encontrado"));}
	private String nomeSeguro(String n){String v=n==null?"arquivo":n.replace("\\","/"); v=v.substring(v.lastIndexOf('/')+1).replaceAll("[\\r\\n]",""); return v.substring(0,Math.min(v.length(),255));}
	private AnexoResumo anexo(AtendimentoAnexo a){return new AnexoResumo(a.getId(),a.getNomeOriginal(),a.getTipoConteudo(),a.getTamanho(),a.getSha256(),a.getEnviadoEm(),a.getEnviadoPor());}
	private AgendaResumo ag(AgendamentoAtendimento a){return new AgendaResumo(a.getId(),a.getTitulo(),a.getObservacao(),a.getInicioEm(),a.getFimEm(),a.getStatus().name(),a.getResponsavel());}
	private AtualizacaoResumo atu(SolicitacaoAtualizacaoCliente s){return new AtualizacaoResumo(s.getId(),s.getNovoTelefone(),s.getNovoEmail(),s.getMotivo(),s.getStatus().name(),s.getSolicitadoPor(),s.getSolicitadoEm());}
}
