package br.com.w4solution.cob4.services.lgpd;
import br.com.w4solution.cob4.domain.*;
import br.com.w4solution.cob4.dto.lgpd.IncidenteDTO;
import br.com.w4solution.cob4.repositories.IncidenteSegurancaRepository;
import br.com.w4solution.cob4.security.*;
import br.com.w4solution.cob4.services.usuario.AuditoriaSegurancaService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.*;
import java.util.List;

@Service
public class IncidenteSegurancaService {
	private final IncidenteSegurancaRepository repository; private final UsuarioAtualService usuarioAtual;
	private final AuditoriaSegurancaService auditoria;
	public IncidenteSegurancaService(IncidenteSegurancaRepository r, UsuarioAtualService u, AuditoriaSegurancaService a){repository=r;usuarioAtual=u;auditoria=a;}
	@Transactional(readOnly=true) public List<IncidenteDTO> listar(){return repository.findAllByOrderByCriadoEmDesc().stream().map(this::dto).toList();}
	@Transactional public IncidenteDTO criar(IncidenteDTO d){var u=usuarioAtual.atual();var agora=OffsetDateTime.now();var i=new IncidenteSeguranca();
		i.setProtocolo("INC-"+agora.getYear()+"-"+java.util.UUID.randomUUID().toString().substring(0,8).toUpperCase()); aplicar(i,d);
		i.setStatus(IncidenteSeguranca.Status.ABERTO);i.setCriadoPor(u.identificador());i.setCriadoEm(agora);i.setAtualizadoPor(u.identificador());i.setAtualizadoEm(agora);
		i=repository.save(i);auditoria.registrar("INCIDENTE_CRIADO",u.nome(),u.identificador(),"Incidente "+i.getProtocolo()+" criado com severidade "+i.getSeveridade());return dto(i);}
	@Transactional public IncidenteDTO atualizar(Long id,IncidenteDTO d){var u=usuarioAtual.atual();var i=repository.findById(id).orElseThrow(()->new IllegalArgumentException("Incidente não encontrado"));
		aplicar(i,d);if(d.status()!=null)i.setStatus(d.status());if(i.getStatus()==IncidenteSeguranca.Status.COMUNICADO){
			if(d.comunicacaoAnpd()==null||d.comunicacaoAnpd().isBlank())throw new IllegalArgumentException("Informe a referência da comunicação à ANPD/titulares");i.setComunicadoEm(i.getComunicadoEm()==null?OffsetDateTime.now():i.getComunicadoEm());}
		if(i.getStatus()==IncidenteSeguranca.Status.ENCERRADO&&(d.medidasAdotadas()==null||d.medidasAdotadas().isBlank()))throw new IllegalArgumentException("Incidente encerrado exige medidas adotadas");
		i.setAtualizadoPor(u.identificador());i.setAtualizadoEm(OffsetDateTime.now());i=repository.save(i);auditoria.registrar("INCIDENTE_ATUALIZADO",u.nome(),u.identificador(),"Incidente "+i.getProtocolo()+" atualizado para "+i.getStatus());return dto(i);}
	private void aplicar(IncidenteSeguranca i,IncidenteDTO d){i.setTitulo(d.titulo().trim());i.setDescricao(d.descricao().trim());i.setDadosAfetados(d.dadosAfetados().trim());i.setTitularesAfetados(d.titularesAfetados());i.setSeveridade(d.severidade());i.setMedidasAdotadas(limpar(d.medidasAdotadas()));i.setComunicacaoAnpd(limpar(d.comunicacaoAnpd()));}
	private String limpar(String s){return s==null||s.isBlank()?null:s.trim();}
	private IncidenteDTO dto(IncidenteSeguranca i){return new IncidenteDTO(i.getId(),i.getProtocolo(),i.getTitulo(),i.getDescricao(),i.getDadosAfetados(),i.getTitularesAfetados(),i.getSeveridade(),i.getStatus(),i.getMedidasAdotadas(),i.getComunicacaoAnpd(),i.getComunicadoEm(),i.getCriadoPor(),i.getCriadoEm(),i.getAtualizadoPor(),i.getAtualizadoEm());}
}
